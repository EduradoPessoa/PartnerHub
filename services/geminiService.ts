import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In a real app, strict error handling for missing API key would be here.
// We assume process.env.API_KEY is available as per instructions.

export const generateSalesPitch = async (
  clientName: string,
  industry: string,
  needs: string,
  executiveName: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Você é um assistente comercial sênior da PHOENYX TECNOLOGIA.
      Seu objetivo é criar um e-mail de apresentação comercial curto e persuasivo (pitch).
      
      Quem está enviando: ${executiveName} (Executivo Comercial Parceiro).
      Cliente Alvo: ${clientName}
      Setor do Cliente: ${industry}
      Necessidade/Dor Identificada: ${needs}
      
      Informações da Phoenyx:
      - Soluções digitais sob medida (Web, Mobile, Sites).
      - Foco em gerar valor e consultoria.
      - "Nós entregamos o código, você foca no negócio".
      
      Gere apenas o corpo do e-mail. O tom deve ser profissional, consultivo e focado em resolver o problema citado.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a proposta no momento.";
  } catch (error) {
    console.error("Error generating pitch:", error);
    return "Erro ao conectar com a IA. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};

export const generateWelcomeEmail = async (
  executiveName: string,
  executiveEmail: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Crie um e-mail de boas-vindas para um novo Executivo Comercial Parceiro da PHOENYX TECNOLOGIA.
      
      Nome do Executivo: ${executiveName}
      
      O e-mail deve conter:
      1. Boas-vindas calorosas ao Partner Hub.
      2. Reforçar o modelo de parceria (Consultoria + Tecnologia).
      3. Dicas rápidas de boas práticas comerciais (Relacionamento, Transparência, Foco no Cliente).
      4. Informações de contato:
         - Site do Partner Hub: partner.phoenyx.com.br
         - Whatsapp para Dúvidas: (11) 99999-9999
         - E-mail de Suporte: partners@phoenyx.com.br
      
      Tom de voz: Profissional, motivador e parceiro.
      Gere apenas o corpo do e-mail (Assunto e Conteúdo).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o e-mail de boas-vindas.";
  } catch (error) {
    console.error("Error generating welcome email:", error);
    return "Erro ao conectar com a IA.";
  }
};