import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process?.env?.SENDGRID_API_KEY ?? "");

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    templateId?: string;
    dynamicData?: any;
}

const sendEmail = async (
    {
        to,
        subject,
        text,
        html,
        templateId,
        dynamicData,
    }: EmailOptions
): Promise<boolean> => {
    const msg = { to, from: 'FitHobo.com <info@fithobo.com>', subject };

    if (text) Object.assign(msg, { text });
    if (html) Object.assign(msg, { html });
    if (templateId) Object.assign(msg, { template_id: templateId });
    if (dynamicData) Object.assign(msg, { dynamic_template_data: dynamicData });

    try {
        // @ts-ignore
        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error(error);
        console.log(error);
        return false;
    }
};

export { sendEmail };
