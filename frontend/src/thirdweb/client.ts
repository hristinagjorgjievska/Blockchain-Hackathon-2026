import { createThirdwebClient } from 'thirdweb';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID as string | undefined;

if (!clientId) {
  console.warn('[thirdweb] VITE_THIRDWEB_CLIENT_ID is not set — login will be unavailable.');
}

export const thirdwebClient = clientId
  ? createThirdwebClient({ clientId })
  : createThirdwebClient({ clientId: 'missing' });
