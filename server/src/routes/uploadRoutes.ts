import { Router, Request, Response } from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://lusfnuqtkrgwkgvabpeo.supabase.co';
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const bucket = (req.body.bucket as string) || 'grage';
    const folder = (req.body.folder as string) || 'uploads';

    if (!secretKey) {
      res.status(500).json({ success: false, message: 'Supabase secret key not configured on server' });
      return;
    }

    const supabaseAdmin = createClient(supabaseUrl, secretKey);

    const fileExt = file.originalname.split('.').pop();
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('[Supabase Server Upload Error]:', error);
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    console.log(`[Supabase Upload Success] File uploaded to ${bucket}: ${publicData.publicUrl}`);

    res.json({
      success: true,
      message: 'File uploaded successfully to Supabase Storage',
      path: data.path,
      url: publicData.publicUrl,
    });
  } catch (err: any) {
    console.error('[Upload Exception]:', err);
    res.status(500).json({ success: false, message: err.message || 'Server upload failure' });
  }
});

export default router;
