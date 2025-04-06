'use client';

import { BillLoadingCard } from '@/components/panel/BillLoadingCard';
import { Input } from '@/components/ui/input';
import { useFetchClients } from '@/hooks/useFetchClients';
import { Dialog } from '@headlessui/react';
import { Download, FileText, Search, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Bill {
  id: string;
  clientNumber: string;
  referenceMonth: string;
  billMonth: string;
  energyConsumptionKwh: number;
  energyConsumptionValue: number;
  compensatedEnergyKWh: number;
  compensatedEnergyValue: number;
  publicLightingValue: number;
  totalValue: number;
}

export default function ClientsPage() {
  const { clients, isLoading, error } = useFetchClients();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [numberFilter, setNumberFilter] = useState('');

  // Filter clients based on search inputs
  const filteredClients = clients?.filter(client => {
    const nameMatch = client.name.toLowerCase().includes(nameFilter.toLowerCase());
    const numberMatch = client.numberClient.includes(numberFilter);
    return nameMatch && numberMatch;
  });

  const downloadBill = async (billId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/bills/${billId}/download`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/pdf, application/json',
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {

          const errorData = await response.json();
          const errorMessage = errorData.message || errorData.error || 'Falha ao baixar o PDF';

          throw new Error(errorMessage);
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('PDF vazio ou inválido');
      }


  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fatura-${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao baixar a fatura. Tente novamente.';
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Painel de Clientes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por número..."
              value={numberFilter}
              onChange={(e) => setNumberFilter(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <BillLoadingCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome da UC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número da UC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distribuidora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consumidor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faturas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients?.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.numberClient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      CEMIG
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                      <div className="max-h-20 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
                        <div className="flex gap-2">
                          {client.bills.map((bill) => (
                            <div
                              key={bill.id}
                              className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedBill(bill);
                                setIsModalOpen(true);
                              }}
                            >
                              <FileText size={16} className="text-green-700" />
                              <span className="text-xs font-medium text-green-800">
                                {bill.billMonth}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Detalhes da Fatura
                </Dialog.Title>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              {selectedBill && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Número do Cliente</p>
                      <p className="text-lg font-medium">{selectedBill.clientNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Mês de Referência</p>
                      <p className="text-lg font-medium">{formatDate(selectedBill.referenceMonth)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Consumo de Energia</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">Consumo</p>
                        <p className="text-lg font-medium">{selectedBill.energyConsumptionKwh} kWh</p>
                        <p className="text-sm text-green-600">{formatCurrency(selectedBill.energyConsumptionValue)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">Energia Compensada</p>
                        <p className="text-lg font-medium">{selectedBill.compensatedEnergyKWh} kWh</p>
                        <p className="text-sm text-green-600">{formatCurrency(selectedBill.compensatedEnergyValue)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedBill.totalValue)}</p>
                      </div>
                      <button
                        onClick={() => downloadBill(selectedBill.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        <Download size={20} />
                        Baixar PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
