export default {
  app: {
    title: 'Gerenciador de Tarefas'
  },
  common: {
    menu: 'Menu',
    yes: 'Sim',
    no: 'Não',
    refresh: 'Atualizar',
    open: 'Abrir',
    cancel: 'Cancelar',
    save: 'Salvar',
    saveChanges: 'Salvar alterações',
    required: 'Obrigatório'
  },


  nav: {
    dashboard: 'Dashboard'
  },

  // =====================
  // AUTH
  // =====================
  auth: {
    email: 'Email',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    fullName: 'Nome completo',
    signIn: 'Entrar',
    signOut: 'Sair',
    createAccount: 'Criar conta',
    alreadyHaveAccount: 'Já tenho conta',
    errors: {
      nameRequired: 'Informe seu nome',
      emailRequired: 'Informe seu email',
      passwordRequired: 'Informe sua senha',
      passwordMinLength: 'Mínimo 6 caracteres',
      passwordMismatch: 'Senhas não conferem',
      generic: 'Não foi possível realizar a operação. Tente novamente.'
    }
  },

  // =====================
  // TASKS
  // =====================
  dashboard:{
    hello: 'Olá, {name} 👋'
  },

  // =====================
  // TASKS
  // =====================
  tasks: {
    title: 'Tarefas',
    new: 'Nova Tarefa',
    create: 'Criar Tarefa',
    edit: 'Editar Tarefa',
    list: 'Minhas Tarefas',
    due: 'Entrega: {date}',
    noDue: 'Sem prazo',
    emptyColumn: 'Sem tarefas',
    status: {
      todo: 'A fazer',
      doing: 'Em andamento',
      done: 'Concluídas'
    },
    fields: {
      name: 'Nome',
      title: 'Título',
      description: 'Descrição',
      dueDate: 'Data de entrega',
      dueDateShort: 'Vencimento',
      assignee: 'Responsável',
      status: 'Status',
      priority: 'Prioridade',
      teamOptional: 'Equipe (opcional)'
    },
    priority: {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta'
    },

    form: {
      yourRole: 'Sua função nesta equipe',
      canAssignOthers: 'Você pode atribuir esta tarefa a outro membro ativo.',
      youWillBeAssignee: 'Você será o responsável por padrão.',
      isDoing: 'Já está em andamento?'
    },

    hints: {
      activeMembersOnly: 'Somente membros ativos (approved)',
      notAdminWillBeAssignee: 'Você não é admin/criador; ficará responsável pela tarefa'
    },

    actions: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir'
    },

    messages: {
      created: 'Tarefa criada com sucesso!',
      updated: 'Tarefa atualizada com sucesso!',
      deleted: 'Tarefa excluída.'
    },

    errors: {
      save: 'Erro ao salvar tarefa'
    }
  },


  // =====================
  // TEAMS
  // =====================
  teams: {
    title: 'Equipes',
    list: 'Minhas equipes',
    new: 'Nova equipe',
    member: 'Membro',
    members: 'Membros',
    noneFound: 'Nenhuma equipe encontrada.',
    create: 'Criar equipe',
    single: 'Equipe',
    fields: {
      name: 'Nome da equipe',
      role: 'Função'
    },
    roles: {
      owner: 'Criador',
      admin: 'Administrador',
      member: 'Membro',
      rejected: 'Rejeitado',
      pending: 'Pendente'
    },
    join: {
      ask: 'Deseja participar desta equipe?',
      teamLabel: 'Equipe: {name}',
      requestButton: 'Solicitar participação',
      pendingBanner: 'Seu pedido para entrar na equipe {name} está aguardando aprovação.',
      pendingTitle: 'Aguardando aprovação do administrador.',
      pendingHint: 'Você será adicionado à equipe assim que aprovarem.',
      rejectedBanner: 'Seu pedido para a equipe {name} foi rejeitado.',
      rejectedTitle: 'Não foi possível entrar na equipe.',
      rejectedHint: 'Fale com um administrador se você acredita que foi um engano.'
    },
    modals: {
      selectRoleTitle: 'Selecione a função para “{name}”',
      ownerLocked: 'O criador da equipe não pode ter a função alterada.'
    },
    hints: {
      chooseRole: 'Escolha a nova função ou rejeite o membro'
    },
    actions: {
      addMember: 'Adicionar membro',
      removeMember: 'Remover membro'
    },
    messages: {
      updated: 'Lista atualizada',
      created: 'Equipe criada com sucesso',
      requestSent: 'Solicitação enviada.',
      saved: 'Alterações salvas com sucesso.'
    },
    errors: {
      load: 'Falha ao carregar equipes',
      loadOne: 'Falha ao carregar equipe',
      nameRequired: 'Informe o nome da equipe',
      create: 'Erro ao criar equipe',
      request: 'Falha ao solicitar participação',
      save: 'Falha ao salvar alterações.',
      cannotModifyMember: 'Não é possível modificar membro. Contacte o criador da equipe.'
    }
  },


  // =====================
  // SETTINGS
  // =====================
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificações'
  },

  // =====================
  // USER
  // =====================
  user: {
    profile: 'Perfil',
    anonymouus: 'Usuário'
  }
}
