import { Resend } from "resend";

export const sendEmail = async ( env: any ,  to: string, subject: string, body: string) => {
    try {
        const resend = new Resend(env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: 'delivered@resend.dev',
        to: to,                       
        subject: subject ,          
        html: body                 
      });
  
      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
      }
  
      return { success: true, data: data };
    } catch (err: any) {
      console.error('Unexpected error:', err);
      return { success: false, error: err.message };
    }
  };

//////////////////////////////////////////////////////////////////////////////

// import nodemailer from 'nodemailer';
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // Use your email service provider
//     auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.verification_password  // Your email password or application-specific password
//     }
// });

// const sendEmail = async (to: string, subject: string, text: string) => {
//     try {
//         const info = await transporter.sendMail({
//             from: process.env.EMAIL_USER, // Sender address
//             to, // Receiver address
//             subject, // Subject line
//             text // Plain text body
//         });
//         console.log('Email sent: %s', info.messageId);
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Could not send email');
//     }
// };


// export {sendEmail};
