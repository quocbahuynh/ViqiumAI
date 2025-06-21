import axios from 'axios';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const BUNNY_STORAGE_NAME = process.env.BUNNY_STORAGE_NAME;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION;
const BUNNY_DOMAIN = process.env.BUNNY_DOMAIN;

export const uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uniqueName = `${uuidv4()}.webp`;
    const filePath = `${BUNNY_STORAGE_NAME}/${uniqueName}`;
    const uploadUrl = `https://${BUNNY_STORAGE_REGION}/${filePath}`;

    // Convert to webp in memory using sharp
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Upload the buffer directly to BunnyCDN
    await axios.put(uploadUrl, webpBuffer, {
      headers: {
        AccessKey: BUNNY_API_KEY,
        'Content-Type': 'image/webp',
        'Content-Length': webpBuffer.length,
      },
    });

    const publicUrl = `${BUNNY_DOMAIN}/${uniqueName}`;
    res.status(200).json({ message: 'Upload successful', url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
