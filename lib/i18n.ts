export type Language = 'pl' | 'en';

export const translations = {
  pl: {
    // Strona główna
    title: 'Team Vote',
    subtitle: 'Głosowanie w czasie rzeczywistym dla spotkań firmowych, eventów i warsztatów',
    features: {
      qr: {
        title: 'Skanuj QR',
        description: 'Uczestnicy łatwo dołączają skanując kod QR'
      },
      live: {
        title: 'Na Żywo', 
        description: 'Wyniki aktualizują się w czasie rzeczywistym'
      },
      clear: {
        title: 'Czytelne',
        description: 'Przejrzyste wykresy słupkowe i statystyki'
      }
    },
    
    // Autentykacja
    auth: {
      adminPanel: 'Panel Administratora',
      login: 'Zaloguj się',
      register: 'Zarejestruj się',
      logout: 'Wyloguj',
      email: 'Email',
      password: 'Hasło',
      confirmPassword: 'Potwierdź hasło',
      loginSubtitle: 'Zaloguj się aby zarządzać głosowaniami',
      registerSubtitle: 'Załóż konto aby zarządzać głosowaniami',
      noAccount: 'Nie masz konta?',
      hasAccount: 'Masz już konto?',
      backHome: 'Powrót do strony głównej',
      checkEmail: 'Sprawdź swoją skrzynkę!',
      emailSent: 'Wysłaliśmy link aktywacyjny na adres',
      activateAccount: 'Kliknij w link aby aktywować konto',
      goToLogin: 'Przejdź do logowania',
      invalidCredentials: 'Nieprawidłowy email lub hasło',
      passwordRequirements: 'Co najmniej 8 znaków, jedna wielka litera, jedna mała litera i jedna cyfra',
      passwordsDontMatch: 'Hasła nie są identyczne',
      loggingIn: 'Logowanie...',
      registering: 'Rejestracja...'
    },
    
    // Panel administratora
    admin: {
      title: 'Panel Administratora',
      subtitle: 'Zarządzaj głosowaniami i zobacz wyniki',
      newPoll: 'Nowe Głosowanie',
      pollTitle: 'Tytuł głosowania',
      pollTitlePlaceholder: 'Np. Która opcja jest najlepsza?',
      options: 'Opcje do wyboru',
      optionPlaceholder: 'Opcja',
      addOption: 'Dodaj opcję',
      maxOptionsReached: 'Osiągnięto maksymalną liczbę opcji (6)',
      createPoll: 'Utwórz głosowanie',
      cancel: 'Anuluj',
      view: 'Zobacz',
      delete: 'Usuń',
      activate: 'Aktywuj',
      deactivate: 'Dezaktywuj',
      confirmDelete: 'Czy na pewno chcesz usunąć to głosowanie?',
      deleteWarning: 'Ta akcja jest nieodwracalna!',
      active: 'Aktywne',
      inactive: 'Nieaktywne',
      votes: 'głosów',
      creating: 'Tworzenie...',
      deleting: 'Usuwanie...',
      displaySettings: 'Ustawienia wyświetlania',
      chartType: 'Typ wykresu',
      horizontalChart: 'Poziomy pasek',
      verticalChart: 'Pionowy pasek',
      pieChart: 'Wykres kołowy',
      displayOptions: 'Opcje wyświetlania',
      showPercentages: 'Pokaż procenty',
      showVoteCounts: 'Pokaż liczby głosów',
      hideBars: 'Ukryj słupki (animacja)',
      saving: 'Zapisywanie...'
    },
    
    // Głosowanie
    voting: {
      thankYou: 'Dziękujemy za głos!',
      voteRecorded: 'Twój głos został zaliczony',
      currentResults: 'Aktualne wyniki:',
      totalVotes: 'Łącznie głosów:',
      chooseOption: 'Wybierz jedną opcję',
      alreadyVoted: 'Już zagłosowałeś w tym głosowaniu',
      devOptions: 'Opcje deweloperskie',
      resetVoting: 'Resetuj możliwość głosowania',
      testingOnly: 'Tylko do testów! Pozwala zagłosować ponownie z tego urządzenia.',
      canVoteAgain: 'Możesz teraz zagłosować ponownie!'
    },
    
    // Wyświetlanie wyników
    display: {
      backToAdmin: 'Panel Administratora',
      live: 'Na żywo',
      waitingForVotes: 'Czekamy na pierwsze głosy...',
      scanQR: 'Zeskanuj QR kodem',
      joinVoting: 'Dołącz do głosowania',
      instructions: {
        step1: '1. Otwórz kamerę w telefonie',
        step2: '2. Zeskanuj kod QR',
        step3: '3. Zagłosuj na swoją opcję'
      }
    },
    
    // Błędy
    errors: {
      notFound: 'Głosowanie nie zostało znalezione',
      loadingError: 'Wystąpił błąd podczas ładowania głosowania',
      votingError: 'Wystąpił błąd podczas głosowania',
      creationError: 'Wystąpił błąd podczas tworzenia głosowania',
      loading: 'Ładowanie głosowania...',
      error: 'Błąd'
    },
    
    // Jak to działa
    howItWorks: {
      title: 'Jak to działa?',
      subtitle: 'Dowiedz się, jak łatwo stworzyć głosowanie i zarządzać nim w czasie rzeczywistym',
      step1: {
        title: 'Stwórz głosowanie',
        description: 'Zaloguj się do panelu administratora i utwórz nowe głosowanie z opcjami do wyboru',
        details: 'Wystarczy podać tytuł i dodać opcje (maksymalnie 6). System automatycznie przydzieli kolory.'
      },
      step2: {
        title: 'Udostępnij kod QR',
        description: 'Uczestnicy skanują kod QR, aby dołączyć do głosowania ze swoich telefonów',
        details: 'Kod QR pojawia się automatycznie na ekranie wyników. Każdy może zagłosować raz.'
      },
      step3: {
        title: 'Dostosuj wyświetlanie',
        description: 'Wybierz typ wykresu i opcje wyświetlania dopasowane do Twojego wydarzenia',
        details: 'Poziomy pasek, pionowy pasek lub wykres kołowy. Pokaż procenty, liczby głosów lub ukryj słupki.'
      },
      step4: {
        title: 'Oglądaj wyniki na żywo',
        description: 'Wyniki aktualizują się w czasie rzeczywistym podczas głosowania uczestników',
        details: 'Przejrzyste wykresy pokazują aktualny stan głosowania z animacjami dla zwycięskiej opcji.'
      },
      features: {
        title: 'Kluczowe funkcje',
        realtime: 'Aktualizacje w czasie rzeczywistym',
        qrcode: 'Łatwe dołączanie przez QR kod',
        responsive: 'Responsywny design',
        charts: 'Różne typy wykresów',
        multilang: 'Obsługa wielu języków',
        secure: 'Bezpieczne głosowanie'
      },
      cta: {
        title: 'Gotowy, aby zacząć?',
        description: 'Stwórz swoje pierwsze głosowanie już dziś',
        button: 'Rozpocznij teraz'
      }
    },

    // Ogólne
    common: {
      loading: 'Ładowanie...',
      save: 'Zapisz',
      cancel: 'Anuluj',
      confirm: 'Potwierdź',
      yes: 'Tak',
      no: 'Nie',
      createFirstPoll: 'Utwórz swoje pierwsze głosowanie!',
      backToHome: 'Strona główna',
      howItWorks: 'Jak to działa?'
    }
  },
  
  en: {
    // Homepage
    title: 'Team Vote',
    subtitle: 'Real-time voting for corporate meetings, events and workshops',
    features: {
      qr: {
        title: 'Scan QR',
        description: 'Participants easily join by scanning a QR code'
      },
      live: {
        title: 'Live',
        description: 'Results update in real-time'
      },
      clear: {
        title: 'Clear',
        description: 'Clean bar charts and statistics'
      }
    },
    
    // Authentication
    auth: {
      adminPanel: 'Admin Panel',
      login: 'Log In',
      register: 'Sign Up',
      logout: 'Log Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginSubtitle: 'Log in to manage polls',
      registerSubtitle: 'Create an account to manage polls',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      backHome: 'Back to homepage',
      checkEmail: 'Check your inbox!',
      emailSent: 'We sent an activation link to',
      activateAccount: 'Click the link to activate your account',
      goToLogin: 'Go to login',
      invalidCredentials: 'Invalid email or password',
      passwordRequirements: 'At least 8 characters, one uppercase letter, one lowercase letter and one digit',
      passwordsDontMatch: 'Passwords do not match',
      loggingIn: 'Logging in...',
      registering: 'Signing up...'
    },
    
    // Admin panel
    admin: {
      title: 'Admin Panel',
      subtitle: 'Manage polls and view results',
      newPoll: 'New Poll',
      pollTitle: 'Poll title',
      pollTitlePlaceholder: 'e.g. Which option is the best?',
      options: 'Voting options',
      optionPlaceholder: 'Option',
      addOption: 'Add option',
      maxOptionsReached: 'Maximum number of options reached (6)',
      createPoll: 'Create poll',
      cancel: 'Cancel',
      view: 'View',
      delete: 'Delete',
      activate: 'Activate',
      deactivate: 'Deactivate',
      confirmDelete: 'Are you sure you want to delete this poll?',
      deleteWarning: 'This action cannot be undone!',
      active: 'Active',
      inactive: 'Inactive',
      votes: 'votes',
      creating: 'Creating...',
      deleting: 'Deleting...',
      displaySettings: 'Display Settings',
      chartType: 'Chart Type',
      horizontalChart: 'Horizontal Bar',
      verticalChart: 'Vertical Bar',
      pieChart: 'Pie Chart',
      displayOptions: 'Display Options',
      showPercentages: 'Show Percentages',
      showVoteCounts: 'Show Vote Counts',
      hideBars: 'Hide Bars (animation)',
      saving: 'Saving...'
    },
    
    // Voting
    voting: {
      thankYou: 'Thank you for voting!',
      voteRecorded: 'Your vote has been recorded',
      currentResults: 'Current results:',
      totalVotes: 'Total votes:',
      chooseOption: 'Choose one option',
      alreadyVoted: 'You have already voted in this poll',
      devOptions: 'Developer options',
      resetVoting: 'Reset voting ability',
      testingOnly: 'Testing only! Allows voting again from this device.',
      canVoteAgain: 'You can now vote again!'
    },
    
    // Display
    display: {
      backToAdmin: 'Admin Panel',
      live: 'Live',
      waitingForVotes: 'Waiting for first votes...',
      scanQR: 'Scan QR code',
      joinVoting: 'Join the voting',
      instructions: {
        step1: '1. Open camera on your phone',
        step2: '2. Scan the QR code',
        step3: '3. Vote for your option'
      }
    },
    
    // Errors
    errors: {
      notFound: 'Poll not found',
      loadingError: 'An error occurred while loading the poll',
      votingError: 'An error occurred while voting',
      creationError: 'An error occurred while creating the poll',
      loading: 'Loading poll...',
      error: 'Error'
    },
    
    // How it works
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Learn how to easily create and manage real-time voting',
      step1: {
        title: 'Create a Poll',
        description: 'Log into the admin panel and create a new poll with voting options',
        details: 'Just provide a title and add options (maximum 6). The system automatically assigns colors.'
      },
      step2: {
        title: 'Share QR Code',
        description: 'Participants scan the QR code to join voting from their phones',
        details: 'QR code appears automatically on the results screen. Everyone can vote once.'
      },
      step3: {
        title: 'Customize Display',
        description: 'Choose chart type and display options tailored to your event',
        details: 'Horizontal bar, vertical bar or pie chart. Show percentages, vote counts or hide bars.'
      },
      step4: {
        title: 'Watch Live Results',
        description: 'Results update in real-time as participants vote',
        details: 'Clear charts show current voting status with animations for the winning option.'
      },
      features: {
        title: 'Key Features',
        realtime: 'Real-time updates',
        qrcode: 'Easy joining via QR code',
        responsive: 'Responsive design',
        charts: 'Multiple chart types',
        multilang: 'Multi-language support',
        secure: 'Secure voting'
      },
      cta: {
        title: 'Ready to get started?',
        description: 'Create your first poll today',
        button: 'Start Now'
      }
    },

    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      createFirstPoll: 'Create your first poll now!',
      backToHome: 'Home',
      howItWorks: 'How It Works'
    }
  }
} as const;

// Helper type to get the structure without literal types
type TranslationStructure = {
  [K in keyof typeof translations.pl]: typeof translations.pl[K] extends string 
    ? string 
    : typeof translations.pl[K] extends object 
    ? {
        [SK in keyof typeof translations.pl[K]]: typeof translations.pl[K][SK] extends string
          ? string
          : typeof translations.pl[K][SK] extends object
          ? {
              [SSK in keyof typeof translations.pl[K][SK]]: string
            }
          : string
      }
    : string
};

export type TranslationKeys = TranslationStructure; 