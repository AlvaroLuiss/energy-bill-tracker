'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { BillCharts } from './bill-charts';
import { BillDataDisplay } from './bill-data-display';

interface ExtractedData {
  clientNumber: string;
  clientName: string;
  referenceMonth: string;
  energyElectric: {
    quantity: number;
    value: number;
  };
  energySCEEE: {
    quantity: number;
    value: number;
  };
  energyCompensated: {
    quantity: number;
    value: number;
  };
  publicLightingContribution: number;
  totalValue: number;
}

export function UploadBill() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<ExtractedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setUploadedData(null);
    } else {
      setError('Por favor, selecione um arquivo PDF válido');
      setFile(null);
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Nenhum arquivo selecionado');
      return;
    }
  
    setIsUploading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:3000/bills/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setUploadedData(data);
      setFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Fatura registrada com sucesso!', {
        duration: 3000,
        position: 'top-center',
        icon: '✅',
      });
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
      toast.error('Erro ao registrar a fatura', {
        duration: 3000,
        position: 'top-center',
        icon: '❌',
      });
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const energyData = useMemo(() => {
    if (!uploadedData) return [];
    
    return [{
      name: 'Consumo de Energia',
      'Energia Elétrica': uploadedData.energyElectric.quantity,
      'Energia Compensada': uploadedData.energyCompensated.quantity,
    }];
  }, [uploadedData]);

  const financialData = useMemo(() => {
    if (!uploadedData) return [];
    
    const totalWithoutGD = uploadedData.energyElectric.value + uploadedData.publicLightingContribution;
    const savings = uploadedData.energyCompensated.value;
    
    return [{
      name: 'Resultados Financeiros',
      'Valor Total sem GD': totalWithoutGD,
      'Economia GD': savings,
    }];
  }, [uploadedData]);

  return (
    <Card className="w-full bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-700">Upload de Fatura</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-green-600">
          Adicione a sua fatura no formato PDF para obter resultados detalhados
        </p>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="border-green-300 focus:border-green-500 cursor-pointer"
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="mt-4 bg-green-600 hover:bg-green-700"
        >
          {isUploading ? 'Enviando...' : 'Enviar PDF'}
        </Button>

        {uploadedData && (
          <>
            <BillDataDisplay data={uploadedData} />
            <BillCharts 
              energyData={energyData}
              financialData={financialData}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
