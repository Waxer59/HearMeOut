export enum CHAT_EVENTS {
  userConnect = 'userConnect',
  userDisconnect = 'userDisconnect',
  friendRequest = 'friendRequest',
  acceptFriendRequest = 'acceptFriendRequest',
  message = 'message',
  typing = 'typing',
  typingOff = 'typingOff',
  newConversation = 'newConversation',
  removeConversation = 'removeConversation',
  friendRequestOutgoing = 'friendRequestOutgoing',
  removeFriendRequest = 'removeFriendRequest',
  createGroup = 'createGroup',
  updateGroup = 'updateGroup',
  openChat = 'openChat',
  deleteMessage = 'deleteMessage',
  updateMessage = 'updateMessage',
  exitGroup = 'exitGroup'
}