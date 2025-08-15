import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

export const onRequest: PagesFunction = async (context) => {
  try {
    const serverBuild = (await import('../build/server')) as unknown as ServerBuild;

    const handler = createPagesFunctionHandler({
      build: serverBuild,
    });

    return handler(context);
  } catch (error) {
    console.error('Failed to load server build:', error);
    return new Response('Server build not found', { status: 500 });
  }
};
