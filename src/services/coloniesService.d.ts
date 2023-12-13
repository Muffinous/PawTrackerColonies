declare module './coloniesService' {
    export function saveColoniesToServer(colonies: number[]): Promise<void>;
    export function saveColonyReport(report: any): Boolean;
  }
  