import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Não deixar o Next.js escrever no nosso CLAUDE.md — é um documento próprio do projeto.
  agentRules: false,
};

export default nextConfig;

// Habilita bindings do Cloudflare (Supabase env vars, etc.) durante `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
