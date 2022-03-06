import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b6d1fab3757769",
          pass: "92256421d73feb"
        }
    });

    //información del email
    const info = await transport.sendMail({
        from: '"TasksHero - Administrador de Proyectos" <cuentas@taskshero.com>',
        to: email,
        subject: "TasksHero - Confirma tu cuenta",
        text: "Comprueba tu cuenta en Taskshero",
        html: `<p>Hola: ${nombre}. Comprueba tu cuenta en TasksHero</p>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
        <p>Si no creaste esta cuenta puedes ignorar este correo</p>
        
        `
    })
}
