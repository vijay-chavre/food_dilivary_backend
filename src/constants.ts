/**
 * @description set of events that we are using in chat app. more to be added as we develop the chat app
 */
export const ChatEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: 'connected',
  // ? when user gets disconnected
  DISCONNECT_EVENT: 'disconnect',
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: 'joinChat',
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: 'leaveChat',
  // ? when admin updates a group name
  UPDATE_GROUP_NAME_EVENT: 'updateGroupName',
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: 'messageReceived',
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: 'newChat',
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: 'socketError',
  // ? when participant stops typing
  STOP_TYPING_EVENT: 'stopTyping',
  // ? when participant starts typing
  TYPING_EVENT: 'typing',
});

export const AvailableChatEvents = Object.values(ChatEventEnum);

export const AccountNatures = Object.freeze({
  ASSETS: {
    CURRENT_ASSETS: 'Current Assets',
    FIXED_ASSETS: 'Fixed Assets',
  },
  LIABILITIES: {
    CURRENT_LIABILITIES: 'Current Liabilities',
    CAPITAL_ACCOUNTS: 'Capital Accounts',
    BRANCH: 'Branch',
    LOAN: 'Loan',
    SUSPENSE_ACCOUNTS: 'Suspense Accounts',
  },
  INCOMES: {
    DIRECT_INCOMES: 'Direct Incomes',
    INDIRECT_INCOMES: 'Indirect Incomes',
    SALES_ACCOUNTS: 'Sales Accounts',
  },
  EXPENSES: {
    DIRECT_EXPENSES: 'Direct Expenses',
    INDIRECT_EXPENSES: 'Indirect Expenses',
    PURCHASE_ACCOUNTS: 'Purchase Accounts',
  },
});

export const NATURES = ['Assets', 'Liabilities', 'Income', 'Expenses'];
export const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'Credit'];

export const defaultGroups = [
  { groupName: 'Sundry Debtors', nature: 'Assets' },
  { groupName: 'Bank Accounts', nature: 'Assets' },
  { groupName: 'Cash-in-Hand', nature: 'Assets' },
  { groupName: 'Stock-in-Hand', nature: 'Assets' },
  { groupName: 'Deposits', nature: 'Assets' },
  { groupName: 'Sundry Creditors', nature: 'Liabilities' },
  { groupName: 'Taxes', nature: 'Liabilities' },
  { groupName: 'Suspense Accounts', nature: 'Liabilities' },
  { groupName: 'Sales Accounts', nature: 'Income' },
  { groupName: 'Purchase Accounts', nature: 'Expenses' },
];

export const defaultLedgers = [
  {
    ledgerName: 'Cash A/c',
    groupName: 'Cash-in-Hand',
    alias: 'Cash A/c',
    narration: 'Total Cash in Hand Account of Company',
    inventoryValuesAffected: false,
    openingBalance: 0,
    maintainBalances: true,
    billByBill: false,
  },
  {
    ledgerName: 'Bank A/c',
    groupName: 'Bank Accounts',
    alias: 'Bank A/c',
    narration: 'Total Cash In Bank Revenue Account of Company',
    inventoryValuesAffected: false,
    openingBalance: 0,
    maintainBalances: true,
    billByBill: false,
  },
  {
    ledgerName: 'Sales A/c',
    groupName: 'Sales Accounts',
    alias: 'Sales A/c',
    narration: 'Sales Revenue Account of Company',
    inventoryValuesAffected: true,
    openingBalance: 0,
    maintainBalances: true,
    billByBill: false,
  },
  {
    ledgerName: 'Purchase A/c',
    groupName: 'Purchase Accounts',
    alias: 'Purchase A/c',
    narration: 'Purchase Revenue Account of Company',
    inventoryAffected: true,
    openingBalance: 0,
    maintainBalances: true,
    billByBill: false,
  },
];
