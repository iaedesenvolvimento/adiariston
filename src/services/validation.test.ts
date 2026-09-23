import { describe, expect, it } from "vitest";

import { validatePrayerInput } from "@/services/prayerValidation";
import { validateVisitorInput } from "@/services/visitorValidation";

describe("validateVisitorInput", () => {
  it("normalizes valid visitor data", () => {
    const result = validateVisitorInput({
      nome: "Maria Silva",
      telefone: "(11) 99999-9999",
      email: "MARIA@EXEMPLO.COM",
      comoConheceu: "google",
      mensagem: "Quero conhecer melhor a igreja.",
      contato: true,
      privacidade: true,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data.email).toBe("maria@exemplo.com");
      expect(result.data.whatsapp).toBe("11999999999");
      expect(result.data.allowsContact).toBe(true);
    }
  });

  it("keeps contact consent optional and privacy required", () => {
    const result = validateVisitorInput({
      nome: "João Souza",
      telefone: "11999999999",
      email: "joao@example.com",
      comoConheceu: "amigo",
      mensagem: "",
      contato: false,
      privacidade: false,
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.fieldErrors.privacidade).toBeTruthy();
      expect(result.fieldErrors).not.toHaveProperty("contato");
    }
  });
});

describe("validatePrayerInput", () => {
  it("creates a private prayer request by default", () => {
    const result = validatePrayerInput({
      nome: "",
      email: "",
      telefone: "",
      pedido: "Gostaria de pedir oração pela minha família.",
      compartilhar: false,
      privacidade: true,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data.visibility).toBe("PRIVADO");
      expect(result.data.sharingConsentAt).toBeNull();
    }
  });

  it("sets sharing consent timestamp for shareable requests", () => {
    const result = validatePrayerInput({
      nome: "Ana",
      email: "ana@example.com",
      telefone: "11999999999",
      pedido: "Pedido de oração compartilhável para teste.",
      compartilhar: true,
      privacidade: true,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data.visibility).toBe("COMPARTILHAVEL");
      expect(result.data.sharingConsentAt).toBeTruthy();
    }
  });
});
