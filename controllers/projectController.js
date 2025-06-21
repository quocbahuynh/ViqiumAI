import mongoose, { disconnect } from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { automapper } from "../config/automapper.js";
import Profession from "../models/Profession.js";
import axios from "axios";
import FacebookFanpage from "../models/FacebookFanpage.js";
import { embedInformation } from "../ai/embed.js";
import { subscribeWebhook, unSubscribeWebhook } from "../util/facebookApi.js";

export const createBaseProject = async (req, res) => {
    const userId = req.user.id;
    const { name, professionId, image, fanpageId, fanpageName, accessToken, avatarUrl } = req.body;

    try {
        const profession = await Profession.findById(professionId);

        if (!userId) {
            return res.status(401).json({ message: "Không tìm thấy người dùng" });
        }

        if (!profession) {
            return res.status(401).json({ message: "Không tìm thấy ngành nghề" });
        }

        let fanpage = await FacebookFanpage.findOne({ pageId: fanpageId });

        const project = await Project.create({
            userId: userId,
            name,
            professionId: new mongoose.Types.ObjectId(professionId),
            baseInformation: profession.description,
            image
        });

        const PROJECT_ID = project._id;
        const longLivedFanpageToken = await exchangeAccessToken(accessToken);

        if (!fanpage) {
            // Create new fanpage
            fanpage = await FacebookFanpage.create({
                accessToken: longLivedFanpageToken,
                active: true,
                avatarUrl,
                fanpageName,
                pageId: fanpageId,
                userId: new mongoose.Types.ObjectId(userId),
                projectId: PROJECT_ID
            });
        } else {
            // If same project or not yet linked, allow update
            fanpage.accessToken = longLivedFanpageToken;
            fanpage.avatarUrl = avatarUrl;
            fanpage.fanpageName = fanpageName;
            fanpage.userId = new mongoose.Types.ObjectId(userId);
            fanpage.projectId = PROJECT_ID
            fanpage.active = true;
            await fanpage.save();


            const duplicatedProjectConnect = await Project.findOne({
                facebookFanpageId: new mongoose.Types.ObjectId(fanpage._id)
            })

            if (duplicatedProjectConnect) {
                duplicatedProjectConnect.facebookFanpageId = null;
                await duplicatedProjectConnect.save();
            }
        }

        project.facebookFanpageId = new mongoose.Types.ObjectId(fanpage._id);
        await project.save();

        await subscribeWebhook(longLivedFanpageToken, fanpageId)
        res.status(200).json({ message: "Tạo dự án thành công", data: project });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};


export const updateBaseProject = async (req, res) => {
    const email = req.user.email;
    const { projectId } = req.params
    const { name, image } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Không tìm thấy người dùng" });
        }

        const project = await Project.findOne({ _id: projectId, userId: user._id });

        if (!project) {
            return res.status(404).json({ message: "Không tìm thấy dự án" });
        }

        project.name = name;
        project.image = image;

        await project.save();

        res.status(200).json({ message: "Cập nhật dự án thành công", data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const deleteProject = async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    try {
        const project = await Project.findOne({
            userId,
            _id: projectId
        });

        if (!project) {
            return res.status(401).json({ message: "Không tìm dự án" });
        }

        await project.deleteOne()
        res.status(200).json({ message: "Xóa dự án thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};


export const getListOfProject = async (req, res) => {
    const userId = req.user.id;
    try {
        const projects = await Project
            .find({ deleted: false, userId: new mongoose.Types.ObjectId(userId) })
            .populate({
                path: 'professionId',
                select: 'name-_id' // Optional: only select needed fields
            })
            .populate({
                path: 'facebookFanpageId',
                select: 'fanpageName avatarUrl -_id' // adjust fields as needed
            })
            .sort({ createdAt: -1 })
            .select('_id name image active createdAt professionId facebookFanpageId')
            .lean();

        // Map the list of projects to the ProjectDTO
        const projectDTOs = projects.map(project =>
            automapper.map('Project', 'ProjectDTO', project)
        );

        res.status(200).json({ message: "Thành công", data: projectDTOs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '"Lỗi máy chủ' });
    }
}

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;
    try {
        let project = await Project
            .findById(projectId)
            .select("name image _id").lean()

        res.status(200).json({ message: "Thành công", data: project });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: '"Lỗi máy chủ' });
    }
}

export const getBaseInformation = async (req, res) => {
    const { projectId } = req.params;

    try {
        let project = await Project
            .findById(projectId)
            .select('baseInformation')

        res.status(200).json({ message: "Thành công", data: project });

    } catch (error) {
        console.error(err);
        res.status(500).json({ message: '"Lỗi máy chủ' });
    }
}


export const updateBaseInformation = async (req, res) => {
    const { projectId } = req.params;
    const { baseInformation } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.baseInformation = baseInformation;

        const updatedProject = await project.save();

        await embedInformation(baseInformation, updatedProject._id, "baseInfo");

        return res.status(200).json({ message: 'Based Information updated', data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '"Lỗi máy chủ' });
    }
}

export const getFanpageFacebookFromToken = async (req, res) => {
    const { accessToken } = req.body;

    try {
        const pagesResponse = await axios.get(`https://graph.facebook.com/me/accounts`, {
            params: {
                access_token: accessToken,
                fields: "id,name,picture,access_token",
            },
        });

        return res.status(200).json({ message: 'Thành công', data: pagesResponse.data.data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}


const exchangeAccessToken = async (shortLivedToken) => {
    const appId = process.env.FB_APP_ID;
    const appSecret = process.env.FB_APP_SECRET;

    const url = `https://graph.facebook.com/v22.0/oauth/access_token`;

    const response = await axios.get(url, {
        params: {
            grant_type: "fb_exchange_token",
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: shortLivedToken,
        },
    });

    if (response.data.error) {
        throw new Error(response.data.error.message);
    }

    return response.data.access_token;
};



export const connectFanpageToProject = async (req, res) => {
    const { fanpageId, fanpageName, accessToken, avatarUrl } = req.body;
    const userId = req.user.id;
    const { projectId } = req.params;

    try {
        const longLivedFanpageToken = await exchangeAccessToken(accessToken);
        await subscribeWebhook(longLivedFanpageToken, fanpageId)
        let fanpage = await FacebookFanpage.findOne({ pageId: fanpageId });

        if (!fanpage) {
            // Create new fanpage
            fanpage = await FacebookFanpage.create({
                accessToken: longLivedFanpageToken,
                active: true,
                avatarUrl,
                fanpageName,
                pageId: fanpageId,
                userId: new mongoose.Types.ObjectId(userId),
                projectId: new mongoose.Types.ObjectId(projectId)
            });
        } else {
            // If same project or not yet linked, allow update
            fanpage.accessToken = longLivedFanpageToken;
            fanpage.avatarUrl = avatarUrl;
            fanpage.fanpageName = fanpageName;
            fanpage.userId = new mongoose.Types.ObjectId(userId);
            fanpage.projectId = new mongoose.Types.ObjectId(projectId);
            fanpage.active = true;
            await fanpage.save();

            const duplicatedProjectConnect = await Project.findOne({
                facebookFanpageId: fanpage._id
            })

            if (duplicatedProjectConnect) {
                duplicatedProjectConnect.facebookFanpageId = null;
                await duplicatedProjectConnect.save();
            }
        }


        // Update project with linked fanpage
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.facebookFanpageId = fanpage._id;
        await project.save();

        res.status(200).json({ message: "Thành công" });
    } catch (error) {
        console.error("Error connecting fanpage to project:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getFanpageInformation = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.facebookFanpageId) {
            return res.status(200).json({ message: 'Fanpage not found', data: null });
        }

        let fanpage = await FacebookFanpage.findById(project.facebookFanpageId);

        return res.status(200).json({
            message: 'Thành công', data: {
                name: fanpage.fanpageName
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}

export const disconnectFanpageFromProject = async (req, res) => {
    const { projectId } = req.params;
    try {

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const fanpage = await FacebookFanpage.findById(project.facebookFanpageId);
        const longLivedFanpageToken = fanpage.accessToken;
        const pageId = fanpage.pageId;

        project.facebookFanpageId = null;
        fanpage.active = false;


        await project.save();
        await fanpage.save();
        await unSubscribeWebhook(longLivedFanpageToken, pageId);

        return res.status(200).json({
            message: 'Thành công'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
}


export const updateAiConfig = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { maxToken, communicationStyle } = req.body;

        // Validate if at least one field is provided
        if (maxToken === undefined && !communicationStyle && !models) {
            return res.status(400).json({ message: "Phải có ít nhất một trường để cập nhật." });
        }

        // Build update object
        const updateFields = {};
        if (maxToken !== undefined) updateFields["aiConfig.maxToken"] = maxToken;
        if (communicationStyle) updateFields["aiConfig.communicationStyle"] = communicationStyle;

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Không tìm thấy project." });
        }

        res.status(200).json({ message: "Cập nhật thành công", data: updatedProject });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const getAiConfigByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required." });
        }

        const project = await Project.findById(projectId).select("aiConfig").lean();

        if (!project) {
            return res.status(404).json({ error: "Project not found." });
        }

        return res.status(200).json({ data: project.aiConfig });
    } catch (error) {
        console.error("Error getting aiConfig:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};