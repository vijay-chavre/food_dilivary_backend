import AWS from 'aws-sdk';
import https from 'https';

AWS.config.update({ region: 'us-east-1' });

const S3 = AWS.S3;
const SSM = AWS.SSM;

const ssm = new AWS.SSM({ region: 'us-east-1' });
const ssmParameterName = '/food-delivery/app/aws-credentials';

const getSSMParameter = async (parameterName) => {
  const params = {
    Name: parameterName,
    WithDecryption: true,
  };

  const { Parameter } = await ssm.getParameter(params).promise();
  console.log(Parameter);
  return Parameter.Value;
};

const initializeAWS = async () => {
  //const awsCredentials = JSON.parse(await getSSMParameter(ssmParameterName));

  const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
    httpOptions: {
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    },
  };

  console.log(awsConfig);

  return new S3(awsConfig);
};

const s3 = async () => {
  return await initializeAWS();
};

export { s3 };
