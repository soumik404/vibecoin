export async function uploadToPinata(file: File): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) throw new Error("Pinata JWT missing");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!data.IpfsHash) throw new Error("Pinata upload failed");

  // Return IPFS gateway URL
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}
