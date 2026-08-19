import { redirect } from "next/navigation";

// /imoveis passou a dividir-se em /comprar e /arrendar.
export default function ImoveisRedirectPage() {
  redirect("/comprar");
}
