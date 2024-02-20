"use server"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email:string, token: string, link: string = `http://localhost:3000/en/active-mail`, label: string = `Click here to verify your email`, isBackLinkEnable=true) => {
    try {
      const confirmLink = isBackLinkEnable ? `<a href="${link}?token=${token}">${label}</a>` : `<p>${label}: ${token}</p>`
        const data = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: [email],
          subject: 'Confirm your email',
          text:"testing",
          html: confirmLink
        });
        return Response.json(data);
      } catch (error) {
        return Response.json({ error });
      }
}
 
export default sendVerificationEmail;