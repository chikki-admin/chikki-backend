const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { AppConfig } = require("../generics/configs");

const client = new S3Client({ 
    region: AppConfig.Region,
    credentials: {
        accessKeyId: AppConfig.AwsAccessKeyId,
        secretAccessKey: AppConfig.SecretAccessKey
    }});

const uploadImage = async (file, key) => {
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const command = new PutObjectCommand({
        Bucket: AppConfig.BucketName,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg'
    });
    try {
        await client.send(command)
        return `https://s3.${AppConfig.Region}.amazonaws.com/${AppConfig.BucketName}/${key}`
    } catch (error) {
        console.error(error);
    }
}

module.exports = { uploadImage }
