/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/..\.history\app\index_20250423111102` | `/..\.history\app\pages\main_20250423110801` | `/..\.history\app\pages\main_20250423110934` | `/..\.history\app\pages\main_20250423110939` | `/..\.history\app\pages\security_20250423110901` | `/..\.history\app\pages\settings_20250423111150` | `/..\.history\app\pages\settings_20250423111155` | `/..\.history\app\pages\settings_20250423111244` | `/Components/AuthContext` | `/Components/Header` | `/_sitemap` | `/elements` | `/main` | `/pages/Calculator` | `/pages/main` | `/pages/question` | `/pages/security` | `/pages/settings` | `/styles/auth` | `/styles/main` | `/styles/modal`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
