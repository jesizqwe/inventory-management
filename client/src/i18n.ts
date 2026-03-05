import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.inventories': 'Inventories',
      'nav.search': 'Search',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.profile': 'Profile',
      'nav.logout': 'Logout',
      'nav.admin': 'Admin',
      
      // Auth
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.name': 'Name',
      'auth.confirmPassword': 'Confirm Password',
      'auth.loginWithGoogle': 'Login with Google',
      'auth.loginWithGithub': 'Login with GitHub',
      'auth.noAccount': "Don't have an account?",
      'auth.haveAccount': 'Already have an account?',
      
      // Home
      'home.recentInventories': 'Recent Inventories',
      'home.topInventories': 'Top Inventories',
      'home.tagCloud': 'Tag Cloud',
      
      // Inventory
      'inventory.create': 'Create Inventory',
      'inventory.edit': 'Edit Inventory',
      'inventory.delete': 'Delete Inventory',
      'inventory.title': 'Title',
      'inventory.description': 'Description',
      'inventory.category': 'Category',
      'inventory.isPublic': 'Public',
      'inventory.tags': 'Tags',
      'inventory.items': 'Items',
      'inventory.access': 'Access Control',
      'inventory.statistics': 'Statistics',
      'inventory.settings': 'Settings',
      'inventory.customIds': 'Custom IDs',
      'inventory.discussion': 'Discussion',
      
      // Items
      'items.add': 'Add Item',
      'items.edit': 'Edit Item',
      'items.delete': 'Delete Item',
      'items.customId': 'Custom ID',
      'items.values': 'Values',

      // Custom Fields
      'customFields.title': 'Custom Fields',
      'customFields.description': 'Configure custom fields for items in this inventory',
      'customFields.stringFields': 'String Fields (single line)',
      'customFields.textFields': 'Text Fields (multi-line)',
      'customFields.numberFields': 'Number Fields',
      'customFields.booleanFields': 'Boolean Fields (checkboxes)',
      'customFields.linkFields': 'Link/Document Fields',
      'customFields.fieldName': 'Field Name',
      'customFields.showInTable': 'Show in table',
      'customFields.enabled': 'Enabled',
      'customFields.addExample': 'Add example values',
      
      // Common
      'common.save': 'Save',
      'common.saved': 'Saved!',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.search': 'Search',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.noData': 'No data available',
      
      // Categories
      'category.equipment': 'Equipment',
      'category.furniture': 'Furniture',
      'category.book': 'Book',
      'category.documents': 'Documents',
      'category.other': 'Other',
      'category.all': 'All Categories',

      // Search
      'search.placeholder': 'Search inventories and items...',
      'search.inventories': 'Inventories',
      'search.items': 'Items',
      'search.inventory': 'Inventory',

      // Themes
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      
      // Languages
      'lang.en': 'English',
      'lang.ru': 'Russian',

      // Profile
      'profile.ownedItems': 'Owned Items',
      'profile.writeAccess': 'Write Access',
      'profile.email': 'Email',
      'profile.role': 'Role',
      'profile.memberSince': 'Member since',
      'profile.noOwnedItems': 'No owned items',
      'profile.noWriteAccess': 'No items with write access',
      'profile.view': 'View',
      'profile.itemIn': 'in',

      // Inventory meta
      'inventory.by': 'by',
      'inventory.items_count_one': '{{count}} item',
      'inventory.items_count_other': '{{count}} items',
      'inventory.creator': 'Creator',
      'inventory.createdAt': 'Created At',
      'inventory.notFound': 'Inventory not found',
      'inventory.imageUrl': 'Image URL',
      'inventory.isPublicHelp': 'If enabled, all authorized users can add items to this inventory',
      'inventory.confirmDelete': 'Are you sure?',
      'inventory.settingsContent': 'Settings content - edit title, description, category, etc.',
      'inventory.noAccessSettings': 'No access to settings',
      'inventory.accessControl': 'Access control - manage user permissions',
      'inventory.noAccessControl': 'No access to control',
      'inventory.statisticsContent': 'Statistics - item counts, field aggregations',

      // Comments
      'comments.add': 'Add a comment...',
      'comments.post': 'Post Comment',
      'comments.loginToComment': 'Login to comment',

      // Items meta
      'items.createdBy': 'by {{name}} • {{date}}',

      // Admin
      'admin.title': 'Admin Panel',
      'admin.userManagement': 'User Management',
      'admin.accessDenied': 'Access denied. Admin only.',
      'admin.failedToLoad': 'Failed to load users',
      'admin.confirmDemoteSelf': 'Are you sure you want to remove your own admin rights?',
      'admin.confirmDelete': 'Are you sure? This cannot be undone.',
      'admin.id': 'ID',
      'admin.name': 'Name',
      'admin.email': 'Email',
      'admin.role': 'Role',
      'admin.status': 'Status',
      'admin.actions': 'Actions',
      'admin.block': 'Block',
      'admin.unblock': 'Unblock',
      'admin.blocked': 'Blocked',
      'admin.active': 'Active',
      'admin.promote': 'Promote',
      'admin.demote': 'Demote',
      'admin.delete': 'Delete',
      'admin.select': 'Select',
      'admin.selected': '{{count}} selected',
      'admin.bulkActions': 'Bulk Actions',
      'admin.noUsersSelected': 'No users selected',
      'admin.blockSelected': 'Block Selected',
      'admin.unblockSelected': 'Unblock Selected',
      'admin.promoteSelected': 'Promote Selected',
      'admin.demoteSelected': 'Demote Selected',
      'admin.deleteSelected': 'Delete Selected',
    },
  },
  ru: {
    translation: {
      // Navigation
      'nav.home': 'Главная',
      'nav.inventories': 'Инвентари',
      'nav.search': 'Поиск',
      'nav.login': 'Войти',
      'nav.register': 'Регистрация',
      'nav.profile': 'Профиль',
      'nav.logout': 'Выйти',
      'nav.admin': 'Админ',
      
      // Auth
      'auth.login': 'Вход',
      'auth.register': 'Регистрация',
      'auth.email': 'Email',
      'auth.password': 'Пароль',
      'auth.name': 'Имя',
      'auth.confirmPassword': 'Подтвердите пароль',
      'auth.loginWithGoogle': 'Войти через Google',
      'auth.loginWithGithub': 'Войти через GitHub',
      'auth.noAccount': 'Нет аккаунта?',
      'auth.haveAccount': 'Уже есть аккаунт?',
      
      // Home
      'home.recentInventories': 'Недавние инвентари',
      'home.topInventories': 'Популярные инвентари',
      'home.tagCloud': 'Облако тегов',
      
      // Inventory
      'inventory.create': 'Создать инвентарь',
      'inventory.edit': 'Редактировать',
      'inventory.delete': 'Удалить',
      'inventory.title': 'Название',
      'inventory.description': 'Описание',
      'inventory.category': 'Категория',
      'inventory.isPublic': 'Публичный',
      'inventory.tags': 'Теги',
      'inventory.items': 'Элементы',
      'inventory.access': 'Доступ',
      'inventory.statistics': 'Статистика',
      'inventory.settings': 'Настройки',
      'inventory.customIds': 'Пользовательские ID',
      'inventory.discussion': 'Обсуждение',
      
      // Items
      'items.add': 'Добавить элемент',
      'items.edit': 'Редактировать',
      'items.delete': 'Удалить',
      'items.customId': 'Пользовательский ID',
      'items.values': 'Значения',

      // Custom Fields
      'customFields.title': 'Пользовательские поля',
      'customFields.description': 'Настройка пользовательских полей для элементов этого инвентаря',
      'customFields.stringFields': 'Текстовые поля (одна строка)',
      'customFields.textFields': 'Текстовые поля (многострочные)',
      'customFields.numberFields': 'Числовые поля',
      'customFields.booleanFields': 'Логические поля (флажки)',
      'customFields.linkFields': 'Поля ссылок/документов',
      'customFields.fieldName': 'Название поля',
      'customFields.showInTable': 'Показывать в таблице',
      'customFields.enabled': 'Включено',
      'customFields.addExample': 'Добавить пример значений',
      
      // Common
      'common.save': 'Сохранить',
      'common.saved': 'Сохранено!',
      'common.cancel': 'Отмена',
      'common.delete': 'Удалить',
      'common.edit': 'Редактировать',
      'common.search': 'Поиск',
      'common.loading': 'Загрузка...',
      'common.error': 'Ошибка',
      'common.noData': 'Нет данных',
      
      // Categories
      'category.equipment': 'Оборудование',
      'category.furniture': 'Мебель',
      'category.book': 'Книга',
      'category.documents': 'Документы',
      'category.other': 'Другое',
      'category.all': 'Все категории',

      // Search
      'search.placeholder': 'Поиск инвентарей и элементов...',
      'search.inventories': 'Инвентари',
      'search.items': 'Элементы',
      'search.inventory': 'Инвентарь',

      // Themes
      'theme.light': 'Светлая',
      'theme.dark': 'Тёмная',
      
      // Languages
      'lang.en': 'Английский',
      'lang.ru': 'Русский',

      // Profile
      'profile.ownedItems': 'Элементы во владении',
      'profile.writeAccess': 'Элементы с правом записи',
      'profile.email': 'Email',
      'profile.role': 'Роль',
      'profile.memberSince': 'Участник с',
      'profile.noOwnedItems': 'Нет элементов во владении',
      'profile.noWriteAccess': 'Нет элементов с правом записи',
      'profile.view': 'Просмотр',
      'profile.itemIn': 'в',

      // Inventory meta
      'inventory.by': 'от',
      'inventory.items_count_one': '{{count}} элемент',
      'inventory.items_count_few': '{{count}} элемента',
      'inventory.items_count_many': '{{count}} элементов',
      'inventory.creator': 'Создатель',
      'inventory.createdAt': 'Дата создания',
      'inventory.notFound': 'Инвентарь не найден',
      'inventory.imageUrl': 'URL изображения',
      'inventory.isPublicHelp': 'Если включено, все авторизованные пользователи смогут добавлять элементы в этот инвентарь',
      'inventory.confirmDelete': 'Вы уверены?',
      'inventory.settingsContent': 'Настройки - изменение названия, описания, категории и т.д.',
      'inventory.noAccessSettings': 'Нет доступа к настройкам',
      'inventory.accessControl': 'Управление доступом - настройка прав пользователей',
      'inventory.noAccessControl': 'Нет доступа к управлению',
      'inventory.statisticsContent': 'Статистика - количество элементов, агрегации полей',

      // Comments
      'comments.add': 'Добавить комментарий...',
      'comments.post': 'Опубликовать',
      'comments.loginToComment': 'Войдите для комментирования',

      // Items meta
      'items.createdBy': 'от {{name}} • {{date}}',

      // Admin
      'admin.title': 'Администрирование',
      'admin.userManagement': 'Управление пользователями',
      'admin.accessDenied': 'Доступ запрещён. Только для администраторов.',
      'admin.failedToLoad': 'Не удалось загрузить пользователей',
      'admin.confirmDemoteSelf': 'Вы уверены, что хотите снять с себя права администратора?',
      'admin.confirmDelete': 'Вы уверены? Это действие нельзя отменить.',
      'admin.id': 'ID',
      'admin.name': 'Имя',
      'admin.email': 'Email',
      'admin.role': 'Роль',
      'admin.status': 'Статус',
      'admin.actions': 'Действия',
      'admin.block': 'Заблокировать',
      'admin.unblock': 'Разблокировать',
      'admin.blocked': 'Заблокирован',
      'admin.active': 'Активен',
      'admin.promote': 'Повысить',
      'admin.demote': 'Понизить',
      'admin.delete': 'Удалить',
      'admin.select': 'Выбрать',
      'admin.selected': 'Выбрано: {{count}}',
      'admin.bulkActions': 'Действия с выбранными',
      'admin.noUsersSelected': 'Пользователи не выбраны',
      'admin.blockSelected': 'Заблокировать выбранных',
      'admin.unblockSelected': 'Разблокировать выбранных',
      'admin.promoteSelected': 'Повысить выбранных',
      'admin.demoteSelected': 'Понизить выбранных',
      'admin.deleteSelected': 'Удалить выбранных',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Custom pluralization function for Russian
// Returns 'one' for 1, 21, 31..., 'few' for 2-4, 22-24..., 'many' for everything else
export function getRussianPlural(count: number): 'one' | 'few' | 'many' {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'one';
  }
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 'few';
  }
  return 'many';
}

// Get plural form based on language
export function getPlural(count: number, language: string): string {
  if (language === 'ru') {
    return getRussianPlural(count);
  }
  // English: 'one' for 1, 'other' for everything else
  return count === 1 ? 'one' : 'other';
}

export default i18n;
