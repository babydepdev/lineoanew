// This file is now just a facade that re-exports from the organized modules
export {
  getLineClient,
  sendLineMessage,
  processWebhookEvents,
  getLineUserProfile
} from './line';