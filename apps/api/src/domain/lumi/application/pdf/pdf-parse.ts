import * as pdfParse from 'pdf-parse';

export interface ExtractedInvoiceData {
  clientNumber: string;
  clientName: string;
  referenceMonth: string;
  energyElectric: { quantity: number; value: number };
  energySCEEE: { quantity: number; value: number };
  energyCompensated: { quantity: number; value: number };
  publicLightingContribution: number;
  totalValue: number;
}

export async function extractPdfText(fileBuffer: Buffer): Promise<ExtractedInvoiceData> {
  try {
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;
    
    console.log('Extracted PDF Text:', text);
    
    // Extração de número do cliente
    let clientNumber = '0';
    const clientNumberRegex1 = /Nº DO CLIENTE\s*(\d+)/i;
    const clientMatch1 = text.match(clientNumberRegex1);
    
    const clientNumberRegex2 = /Nº DO CLIENTE[\s\S]*?(\d{7,10})\s+\d+/i;
    const clientMatch2 = text.match(clientNumberRegex2);
    
    // Outra forma de extrair o número do cliente
    const clientNumberRegex3 = /N[ºo°]\s*DO\s*CLIENTE[\s\S]*?(\d{7,10})/i;
    const clientMatch3 = text.match(clientNumberRegex3);
    
    // Procura um número de 10 dígitos no contexto
    const clientNumberRegex4 = /(\d{10})(?=\s+\d{10}|\s+300\d+)/;
    const clientMatch4 = text.match(clientNumberRegex4);
    
    if (clientMatch1) clientNumber = clientMatch1[1];
    else if (clientMatch2) clientNumber = clientMatch2[1];
    else if (clientMatch3) clientNumber = clientMatch3[1];
    else if (clientMatch4) clientNumber = clientMatch4[1];
    
    // Extração de nome do cliente
    let clientName = '';
    
    // Procura o nome em letras maiúsculas após a linha do mês/ano
    const clientNameRegex1 = /(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\/\d{4}.*\n([A-Z][A-Z\s]+)(?=\n)/i;
    const clientNameMatch1 = text.match(clientNameRegex1);
    
    // Procura por um nome em letras maiúsculas seguido de um número de 8 dígitos ou um número seguido de uma nova linha
    const clientNameRegex2 = /\n([A-Z][A-Z\s]+)(?=\s+\d{8}|\s+\d+\n)/;
    const clientNameMatch2 = text.match(clientNameRegex2);
    
    // Procura por um nome seguido de um endereço
    const clientNameRegex3 = /\d{1,2}-\d\s+(.+?)\n(RUA|AV|AVENIDA|ALAMEDA|PRAÇA)/i;
    const clientNameMatch3 = text.match(clientNameRegex3);
    
    // Procura por um nome em letras maiúsculas seguido de uma nova linha entre 10 e 50 caracteres
    const clientNameRegex4 = /\n([A-Z][A-Z\s]{10,50})\n/;
    const clientNameMatch4 = text.match(clientNameRegex4);
    
    if (clientNameMatch1) clientName = clientNameMatch1[2].trim();
    else if (clientNameMatch2) clientName = clientNameMatch2[1].trim();
    else if (clientNameMatch3) clientName = clientNameMatch3[1].trim();
    else if (clientNameMatch4) clientName = clientNameMatch4[1].trim();
    
    // Extração do mês de referência
    let referenceMonth = '0';
    const monthsMap: { [key: string]: string } = {
      'janeiro': 'JAN',
      'fevereiro': 'FEV',
      'março': 'MAR',
      'marco': 'MAR',
      'abril': 'ABR',
      'maio': 'MAI',
      'junho': 'JUN',
      'julho': 'JUL',
      'agosto': 'AGO',
      'setembro': 'SET',
      'outubro': 'OUT',
      'novembro': 'NOV',
      'dezembro': 'DEZ'
    };
    
    const referenceMonthRegex1 = /Referente a\s+([A-Z]{3}\/\d{4})/i;
    const refMatch1 = text.match(referenceMonthRegex1);
    
    const referenceMonthRegex2 = /(?:Referente a|mês\/ano)[\s\S]{1,50}?([A-Z]{3}\/\d{4})/i;
    const refMatch2 = text.match(referenceMonthRegex2);
    
    const referenceMonthRegex3 = /(?:Referente a|mês\/ano)[\s\S]{1,50}?([a-zç]+)\/(\d{4})/i;
    const refMatch3 = text.match(referenceMonthRegex3);
    
    const referenceMonthRegex4 = /([a-zç]+)\/(\d{4})/i;
    const refMatch4 = text.match(referenceMonthRegex4);
    
    if (refMatch1) {
      referenceMonth = refMatch1[1].toUpperCase();
    } else if (refMatch2) {
      referenceMonth = refMatch2[1].toUpperCase();
    } else if (refMatch3) {
      const monthName = refMatch3[1].toLowerCase();
      const year = refMatch3[2];
      
      for (const [fullName, abbr] of Object.entries(monthsMap)) {
        if (monthName.includes(fullName) || fullName.includes(monthName)) {
          referenceMonth = `${abbr}/${year}`;
          break;
        }
      }
    } else if (refMatch4) {
      const monthName = refMatch4[1].toLowerCase();
      const year = refMatch4[2];
      
      for (const [fullName, abbr] of Object.entries(monthsMap)) {
        if (monthName.includes(fullName) || fullName.includes(monthName)) {
          referenceMonth = `${abbr}/${year}`;
          break;
        }
      }
    }
    
    // Extração de energia elétrica
    const energyElectricRegex = /Energia Elétrica[\s\n]*kWh[\s\n]*(\d+(?:\.\d{3})?)[\s\n]+([\d,]+)[\s\n]+([\d,]+)/i;
    const energyElectricMatch = text.match(energyElectricRegex);
    const energyElectric = {
      quantity: energyElectricMatch ? parseNumber(energyElectricMatch[1]) : 0,
      value: energyElectricMatch ? parseNumber(energyElectricMatch[3]) : 0,
    };
    
    // Extração de energia SCEEE
    const energySCEEERegex = /Energia SCEE s\/[\s\n]*ICMS[\s\n]*kWh[\s\n]*(\d+(?:\.\d+)?)[\s\n]*(\d+(?:[,\.]\d+)?)[\s\n]*(\d+(?:[,\.]\d+)?)/i;    
    const energySCEEEMatch = text.match(energySCEEERegex);
    const energySCEEE = {
      quantity: energySCEEEMatch ? parseNumber(energySCEEEMatch[1]) : 0,
      value: energySCEEEMatch ? parseNumber(energySCEEEMatch[3]) : 0,
    };
    
    // Extração de energia compensada
    const energyCompensatedRegex = /Energia compensada GD I[\s\n]*kWh[\s\n]*(\d[\d\.\s]+)[\s\n]+([\d,\.]+)[\s\n]+(-?[\d,\.]+)/i;    const energyCompensatedMatch = text.match(energyCompensatedRegex);
    const energyCompensated = {
      quantity: energyCompensatedMatch ? parseNumber(energyCompensatedMatch[1]) : 0,
      value: energyCompensatedMatch ? parseNumber(energyCompensatedMatch[3]) : 0,
    };
    
    // Extração de contribuição de iluminação pública
    const publicLightingRegex = /Contrib Ilum Publica Municipal[\s\n]*([\d\s,.]+)/i;
    const publicLightingContribution = parseNumber(extractValue(text, publicLightingRegex));
    
    // Extração do valor total
    const totalValueRegex = /TOTAL[\s\n]*([\d\s,.]+)/i;
    const totalValue = parseNumber(extractValue(text, totalValueRegex));
    
    const extractedData: ExtractedInvoiceData = {
      clientNumber,
      clientName,
      referenceMonth,
      energyElectric,
      energySCEEE,
      energyCompensated,
      publicLightingContribution,
      totalValue
    };
    
    console.log('Extracted Data:', extractedData);
    
    return extractedData;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

function extractValue(text: string, regex: RegExp): string {
  const match = text.match(regex);
  return match && match[1] ? match[1] : '0';
}

function parseNumber(value: string): number {
  if (!value) return 0;
  
  // Remove all spaces first
  let normalizedValue = value.trim().replace(/\s/g, '');
  
  // For Brazilian/European format where periods are thousand separators 
  // and commas are decimal points (e.g., "2.300,00")
  if (normalizedValue.includes('.') && normalizedValue.includes(',')) {
    // If both period and comma exist, and period comes before comma,
    // assume period is thousand separator
    if (normalizedValue.indexOf('.') < normalizedValue.indexOf(',')) {
      normalizedValue = normalizedValue.replace(/\./g, '').replace(',', '.');
    }
  } 
  // If only period exists and it's clearly a thousand separator (e.g., "2.300")
  else if (normalizedValue.includes('.') && !normalizedValue.includes(',')) {
    // Check if the period is likely a thousand separator 
    // (usually has 3 digits following it)
    const parts = normalizedValue.split('.');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      normalizedValue = normalizedValue.replace(/\./g, '');
    }
  }
  // If only comma exists, treat it as decimal separator
  else if (normalizedValue.includes(',') && !normalizedValue.includes('.')) {
    normalizedValue = normalizedValue.replace(',', '.');
  }
  
  // Handle any remaining non-numeric characters (except decimal point)
  normalizedValue = normalizedValue.replace(/[^\d.-]/g, '');
  
  return parseFloat(normalizedValue) || 0;
}