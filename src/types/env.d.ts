interface ImportMetaEnv {
  readonly VUE_APP_FIREBASE_API_KEY: string;
  readonly VUE_APP_FIREBASE_AUTH_DOMAIN: string;
  readonly VUE_APP_FIREBASE_PROJECT_ID: string;
  readonly VUE_APP_FIREBASE_STORAGE_BUCKET: string;
  readonly VUE_APP_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VUE_APP_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
