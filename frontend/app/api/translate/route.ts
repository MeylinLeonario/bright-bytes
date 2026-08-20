const MAX_WORDS = 6;

type TranslationRequest = {
  text?: unknown;
  targetLang?: unknown;
};

type DeepLResponse = {
  translations?: Array<{ text?: string }>;
  message?: string;
};

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export async function POST(request: Request) {
  let body: TranslationRequest;

  try {
    body = (await request.json()) as TranslationRequest;
  } catch {
    return Response.json({ message: "La solicitud no es válida." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const targetLang = body.targetLang === "EN" ? "EN" : body.targetLang === "ES" ? "ES" : null;

  if (!text) {
    return Response.json({ message: "Escribe algo para traducir." }, { status: 400 });
  }

  if (countWords(text) > MAX_WORDS) {
    return Response.json({ message: `Puedes traducir un máximo de ${MAX_WORDS} palabras.` }, { status: 400 });
  }

  if (!targetLang) {
    return Response.json({ message: "El idioma de destino no es válido." }, { status: 400 });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return Response.json({ message: "El traductor todavía no está configurado." }, { status: 503 });
  }

  const endpoint = process.env.DEEPL_API_URL
    ?? (apiKey.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate");
  const form = new URLSearchParams({ text, target_lang: targetLang });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({})) as DeepLResponse;

    if (!response.ok) {
      console.error("DeepL translation failed", response.status, result.message);
      return Response.json({ message: "No pudimos traducir en este momento. Inténtalo de nuevo." }, { status: 502 });
    }

    const translation = result.translations?.[0]?.text;
    if (!translation) {
      return Response.json({ message: "DeepL no devolvió una traducción." }, { status: 502 });
    }

    return Response.json({ translation });
  } catch (error) {
    console.error("DeepL request failed", error);
    return Response.json({ message: "No pudimos conectar con el traductor." }, { status: 502 });
  }
}