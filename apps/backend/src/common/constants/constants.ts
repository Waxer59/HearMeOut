export const AUTH_COOKIE = 'authorization';

export const CHAT_EVENTS = {
  userConnect: 'userConnect',
  userDisconnect: 'userDisconnect',
  friendRequest: 'friendRequest',
  acceptFriendRequest: 'acceptFriendRequest',
  message: 'message',
  typing: 'typing',
  typingOff: 'typingOff',
  newConversation: 'newConversation',
  removeConversation: 'removeConversation',
  friendRequestOutgoing: 'friendRequestOutgoing',
  removeFriendRequest: 'removeFriendRequest',
  createGroup: 'createGroup',
  openChat: 'openChat',
};

export const CACHE_PREFIXES = {
  usersActiveChat: 'usersActiveChat:',
};

export const ACCEPTED_IMG_EXTENSIONS = ['png', 'gif', 'jpg', 'jpeg'];
