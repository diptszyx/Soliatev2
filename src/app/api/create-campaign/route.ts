import { NextResponse } from 'next/server';
import axios from 'axios';
import { Buffer } from 'node:buffer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as any;
    const campaignData = JSON.parse(formData.get('campaignData') as string);

    // Upload file to Pinata
    const imageUri = await uploadToPinata(await file.arrayBuffer(), file.name);

    // Create metadata
    const metadata = {
      name: campaignData.campaignName,
      description: campaignData.description,
      image: imageUri,
      attributes: [
        { trait_type: "Total SOL Amount", value: campaignData.totalSolAmount },
        { trait_type: "Number of Participants", value: campaignData.numberOfParticipants },
        { trait_type: "Percentage for Sharer", value: campaignData.percentageForSharer },
      ],
    };

    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataUri = await uploadToPinata(metadataBuffer, 'metadata.json');

    return NextResponse.json({ imageUri, metadataUri });
  } catch (error) {
    console.error("Error in create-campaign API:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

async function uploadToPinata(buffer: ArrayBuffer | Buffer, fileName: string): Promise<string> {
  const formData = new FormData();
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

  formData.append('file', new Blob([buffer]), fileName);

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Pinata API error: ${response.status} ${response.statusText}`);
    }

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error in uploadToPinata:", error);
    throw error;
  }
}