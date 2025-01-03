import OSSClient from "ali-oss";

const OSS_DIRECTORY = "agentnexus";

class StorageClient {
  private client: OSSClient;

  constructor() {
    this.client = new OSSClient({
      region: process.env.STORAGE_REGION,
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID as string,
      accessKeySecret: process.env.STORAGE_ACCESS_KEY_SECRET as string,
      bucket: process.env.STORAGE_BUCKET,
    });
  }

  async upload(name: string, body: Blob | Buffer) {
    return await this.client.put(`${OSSClient}/${name}`, body);
  }

  async fetch(name: string) {
    return this.client.get(`${OSS_DIRECTORY}/${name}`);
  }

  async delete(name: string) {
    return await this.client.delete(`${OSS_DIRECTORY}/${name}`);
  }

  async getSignedUrl(name: string) {
    return await this.client.signatureUrl(`${OSS_DIRECTORY}/${name}`);
  }
}

export const storage = new StorageClient();
