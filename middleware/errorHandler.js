import { transporter } from '../config/mail.js';

export const errorHandler = async (err, req, res, next) => {
    console.error('🔥 Server Error:', err);

    const errorDetails = `
🧨 Error: ${err.message}
📍 Path: ${req.originalUrl}
🧑‍💻 Method: ${req.method}
📦 Stack: ${err.stack}
🕒 Time: ${new Date().toISOString()}
  `;

    // Send email to admin
    const mailOptions = {
        from: '"Viqium Server Alert" <hi.viqium@gmail.com>',
        to: 'quochbmakeai@gmail.com',
        subject: '🚨 Server Error Occurred',
        text: errorDetails,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📬 Error email sent');
    } catch (emailErr) {
        console.error('❌ Failed to send error email:', emailErr);
    }

    // Return clean error response
    res.status(err.status || 500).json({
        message: 'Server error occurred. Our team has been notified.',
    });
};
