import { AnonymizationRule, DocumentClass } from "@/types";

export const mockDocumentClasses: DocumentClass[] = [
  {
    id: "1",
    name: "Certidão Civil",
    rule: AnonymizationRule.ALLOWED,
    documentTypes: [
      {
        id: "1-1",
        name: "Certidão de Nascimento",
        rule: AnonymizationRule.RESTRICTED,
        days: 30,
        documentClassId: "1",
        documentClass: {} as any,
        labels: [
          {
            id: "1-1-1",
            name: "Nome Completo do Titular",
            rule: AnonymizationRule.NOT_ALLOWED,
            documentTypeId: "1-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "1-1-2",
            name: "CPF do Titular",
            rule: AnonymizationRule.NOT_ALLOWED,
            documentTypeId: "1-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "1-1-3",
            name: "Data de Nascimento",
            rule: AnonymizationRule.RESTRICTED,
            days: 90,
            documentTypeId: "1-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "1-2",
        name: "Certidão de Casamento",
        rule: AnonymizationRule.ALLOWED,
        documentClassId: "1",
        documentClass: {} as any,
        labels: [
          {
            id: "1-2-1",
            name: "Nome Completo dos Cônjuges",
            rule: AnonymizationRule.RESTRICTED,
            days: 60,
            documentTypeId: "1-2",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "1-2-2",
            name: "Data do Casamento",
            rule: AnonymizationRule.ALLOWED,
            documentTypeId: "1-2",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Documento Bancário",
    rule: AnonymizationRule.RESTRICTED,
    days: 180,
    documentTypes: [
      {
        id: "2-1",
        name: "Boleto Bancário",
        rule: AnonymizationRule.NOT_ALLOWED,
        documentClassId: "2",
        documentClass: {} as any,
        labels: [
          {
            id: "2-1-1",
            name: "Nome do Pagador",
            rule: AnonymizationRule.NOT_ALLOWED,
            documentTypeId: "2-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "2-1-2",
            name: "Valor do Boleto",
            rule: AnonymizationRule.RESTRICTED,
            days: 365,
            documentTypeId: "2-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2-2",
        name: "Comprovante de Transferência",
        documentClassId: "2",
        documentClass: {} as any,
        labels: [
          {
            id: "2-2-1",
            name: "Valor da Transação",
            rule: AnonymizationRule.ALLOWED,
            documentTypeId: "2-2",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Documento Fiscal",
    rule: AnonymizationRule.ALLOWED,
    documentTypes: [
      {
        id: "3-1",
        name: "Nota Fiscal Eletrônica (NF-e)",
        rule: AnonymizationRule.ALLOWED,
        documentClassId: "3",
        documentClass: {} as any,
        labels: [
          {
            id: "3-1-1",
            name: "Chave de Acesso da NF-e",
            rule: AnonymizationRule.ALLOWED,
            documentTypeId: "3-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "3-1-2",
            name: "Nome do Consumidor",
            rule: AnonymizationRule.RESTRICTED,
            days: 120,
            documentTypeId: "3-1",
            documentType: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const generateMockReports = () => {
  const classes = [];
  const types = [];
  const labels = [];
  
  for (const docClass of mockDocumentClasses) {
    if (docClass.rule) {
      classes.push({
        id: docClass.id,
        name: docClass.name,
        rule: docClass.rule,
        restrictionDays: docClass.days
      });
    }
    
    for (const docType of docClass.documentTypes || []) {
      if (docType.rule) {
        types.push({
          id: docType.id,
          name: docType.name,
          rule: docType.rule,
          restrictionDays: docType.days,
          class: {
            id: docClass.id,
            name: docClass.name
          }
        });
      }
      
      for (const label of docType.labels || []) {
        if (label.rule) {
          labels.push({
            id: label.id,
            name: label.name,
            rule: label.rule,
            restrictionDays: label.days,
            type: {
              id: docType.id,
              name: docType.name,
              class: {
                id: docClass.id,
                name: docClass.name
              }
            }
          });
        }
      }
    }
  }
  
  return {
    summary: {
      totalClasses: classes.length,
      totalTypes: types.length,
      totalLabels: labels.length,
    },
    classes,
    types,
    labels
  };
};