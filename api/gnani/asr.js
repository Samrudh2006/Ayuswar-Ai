/**
 * Alias route for /api/gnani/stt
 */
import handler from './stt.js';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};
export default handler;
