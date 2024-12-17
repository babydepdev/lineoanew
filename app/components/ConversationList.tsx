import { ConversationWithMessages } from '../types/chat';
import { ConversationListContainer } from './chat/conversation-list/ConversationListContainer';

interface ConversationListProps {
  conversations: ConversationWithMessages[];
  onSelect: (conversation: ConversationWithMessages) => void;
  selectedId?: string;
}

export default function ConversationList(props: ConversationListProps) {
  return <ConversationListContainer {...props} />;
}