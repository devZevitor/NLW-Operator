# Workflow com Agentes de IA (Aprender sem Terceirizar o Entendimento)

## Princípio Central
Agentes devem acelerar execução, não substituir raciocínio técnico.

Regra prática:
- Se você não consegue explicar a mudança sem olhar o código, ainda não aprendeu.

## Quando Usar Agentes

Use agentes para:
- Explorar código existente e mapear arquitetura.
- Gerar rascunho inicial de specs.
- Criar boilerplate repetitivo (routers, tipos, componentes simples).
- Propor testes e checklist de revisão.
- Sugerir refactors pequenos e incrementais.

## Quando Nao Usar Agentes

Evite delegar totalmente quando:
- A feature muda regras de negocio centrais.
- Existe impacto em modelagem de dados e migracoes.
- A seguranca e sensivel (auth, permissao, dados privados).
- Voce nao entendeu o fluxo atual de dados.

Nesses casos, use o agente para apoiar investigacao, nao para decidir sozinho.

## Como Revisar Codigo Gerado por Agentes

Checklist minimo de revisao:

1. Contrato e tipagem:
- Inputs validados com Zod?
- Tipos estao inferidos corretamente no cliente?

2. Arquitetura:
- A mudanca respeita separacao UI/API/dados?
- Componentes server/client estao corretos?

3. Dados:
- Mudou schema? Gerou migracao?
- Existe fallback para erro de DB/API?

4. UX:
- Loading, erro e estado vazio foram tratados?
- Componente ficou consistente com o design system?

5. Qualidade:
- Rodou lint/format?
- Existe teste ou plano de teste manual?

## Fluxo Recomendado para Novas Features

1. Ler contexto atual (`docs/*` e `specs/*`).
2. Criar/atualizar spec da feature em `specs/`.
3. Revisar impactos (arquitetura, API, DB, UI).
4. Implementar em pequenos commits mentais (passos curtos).
5. Revisar com checklist e validar localmente.
6. Atualizar docs se a arquitetura mudou.

## Modo de Aprendizado Ativo com IA

Para cada entrega, responda:
- O que foi alterado?
- Por que foi alterado desse jeito?
- Quais trade-offs foram aceitos?
- Como eu implementaria isso sem agente?

Se nao souber responder, volte e estude antes de seguir.

## Anti-Pattern Comum
"Copiar e colar do agente direto na branch principal".

Risco:
- Debt de entendimento: o projeto evolui, mas voce nao.

Alternativa:
- Trabalhar por blocos pequenos, revisar cada bloco, executar app e validar comportamento antes de prosseguir.

## Ferramentas no Contexto Deste Projeto
- GitHub Copilot: assistente de implementacao e revisao.
- Context7: suporte para documentacao e referencia de bibliotecas.
- Pencil: suporte para tarefas de design/prototipacao quando houver arquivos `.pen`.
- Opencode: ambiente de execucao e automacao de tarefas de engenharia com agentes.
