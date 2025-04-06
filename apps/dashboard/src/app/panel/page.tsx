'use client';

import { BillLoadingCard } from '@/components/panel/BillLoadingCard';
import { useFetchClients } from '@/hooks/useFetchClients';

export default function ClientsPage() {
  const { clients, isLoading, error } = useFetchClients();

  const hasBillForMonth = (billIds: string[], month: number) => {
    return billIds.some(billId => {
      const bill = clients.flatMap(client => client.bills).find(bill => bill.id === billId);
      if (!bill) return false;
      
      const billDate = new Date(bill.referenceMonth);
      return billDate.getMonth() === month;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Painel de Clientes
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
              Consumidores
            </button>
            <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
              Distribuidoras
            </button>
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
                {clients.map((client) => (
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
                      <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
                        <div className="grid grid-cols-2 gap-3">
                          {client.bills.map((bill: any) => {
                            console.log('Bill data:', bill.referenceMonth);
                            return (
                              <div
                                key={bill.id}
                                className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer shadow-sm"
                                onClick={() => console.log('Fatura selecionada:', bill)}
                              >
                                <div className="flex flex-col w-full">
                                  <span className="text-sm font-medium text-green-800">
                                    {bill.billMonth} 
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
