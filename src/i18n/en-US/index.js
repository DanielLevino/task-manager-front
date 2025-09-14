export default {
  app: {
    title: 'Task Manager'
  },

  common: {
    menu: 'Menu',
    yes: 'Yes',
    no: 'No',
    refresh: 'Refresh',
    open: 'Open',
    cancel: 'Cancel',
    save: 'Save',
    saveChanges: 'Save changes',
    required: 'Required'
  },

  nav: {
    dashboard: 'Dashboard'
  },

  // =====================
  // AUTH
  // =====================
  auth: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    signIn: 'Sign in',
    signOut: 'Sign out',
    createAccount: 'Create account',
    alreadyHaveAccount: 'Already have an account',
    errors: {
      nameRequired: 'Please enter your name',
      emailRequired: 'Please enter your email',
      passwordRequired: 'Please enter your password',
      passwordMinLength: 'Minimum 6 characters',
      passwordMismatch: 'Passwords do not match',
      generic: 'Operation failed. Please try again.'
    }
  },

  // =====================
  // DASHBOARD
  // =====================
  dashboard: {
    hello: 'Hello, {name} 👋'
  },

  // =====================
  // TASKS
  // =====================
  tasks: {
    title: 'Tasks',
    new: 'New Task',
    create: 'Create Task',
    edit: 'Edit Task',
    list: 'My Tasks',
    due: 'Due: {date}',
    noDue: 'No due date',
    emptyColumn: 'No tasks',
    status: {
      todo: 'To do',
      doing: 'In progress',
      done: 'Done'
    },
    fields: {
      name: 'Name',
      title: 'Title',
      description: 'Description',
      dueDate: 'Due date',
      dueDateShort: 'Due',
      assignee: 'Assignee',
      status: 'Status',
      priority: 'Priority',
      teamOptional: 'Team (optional)'
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    form: {
      yourRole: 'Your role in this team',
      canAssignOthers: 'You can assign this task to another active member.',
      youWillBeAssignee: 'You will be assigned by default.',
      isDoing: 'Already in progress?'
    },
    hints: {
      activeMembersOnly: 'Active members only (approved)',
      notAdminWillBeAssignee: 'You are not an admin/creator; you will be assigned to the task'
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete'
    },
    messages: {
      created: 'Task created successfully!',
      updated: 'Task updated successfully!',
      deleted: 'Task deleted.'
    },
    errors: {
      save: 'Error saving task'
    }
  },

  // =====================
  // TEAMS
  // =====================
  teams: {
    title: 'Teams',
    list: 'My teams',
    new: 'New team',
    member: 'Member',
    members: 'Members',
    noneFound: 'No teams found.',
    create: 'Create team',
    single: 'Team',
    fields: {
      name: 'Team name',
      role: 'Role'
    },
    roles: {
      owner: 'Owner',
      admin: 'Admin',
      member: 'Member',
      rejected: 'Rejected',
      pending: 'Pending'
    },
    join: {
      ask: 'Do you want to join this team?',
      teamLabel: 'Team: {name}',
      requestButton: 'Request to join',
      pendingBanner: 'Your request to join team {name} is awaiting approval.',
      pendingTitle: 'Awaiting administrator approval.',
      pendingHint: 'You will be added to the team once approved.',
      rejectedBanner: 'Your request to join team {name} was rejected.',
      rejectedTitle: 'Could not join the team.',
      rejectedHint: 'Contact an administrator if you believe this was a mistake.'
    },
    modals: {
      selectRoleTitle: 'Select a role for “{name}”',
      ownerLocked: 'The team owner’s role cannot be changed.'
    },
    hints: {
      chooseRole: 'Choose a new role or reject the member'
    },
    actions: {
      addMember: 'Add member',
      removeMember: 'Remove member'
    },
    messages: {
      updated: 'List updated',
      created: 'Team created successfully',
      requestSent: 'Request sent.',
      saved: 'Changes saved successfully.'
    },
    errors: {
      load: 'Failed to load teams',
      loadOne: 'Failed to load team',
      nameRequired: 'Please enter the team name',
      create: 'Error creating team',
      request: 'Failed to submit request',
      save: 'Failed to save changes.',
      cannotModifyMember: 'You cannot modify a member. Contact the team owner.'
    }
  },

  // =====================
  // SETTINGS
  // =====================
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications'
  },

  // =====================
  // USER
  // =====================
  user: {
    profile: 'Profile',
    anonymous: 'User'
  }
}
