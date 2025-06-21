import Profession from "../models/Profession.js";

export const getListOfProfessional = async (req, res) => {
    try {
        const data = await Profession.find({ active: true }).select('_id name').lean();
        const professionDTO = automapper.map('Profession', 'ProfessionDTO', data);
        res.status(200).json({ message: "Thành công", data: professionDTO });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '"Lỗi máy chủ' });
    }
}