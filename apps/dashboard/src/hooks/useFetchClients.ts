import { useEffect, useState } from 'react';

interface Bill {
  id: string;
  clientId: string;
  clientNumber: string;
  referenceMonth: string;
  billMonth: string;
  pdfPath: string;
  energyConsumptionKwh: number;
  energyConsumptionValue: number;
  sceeEnergyKWh: number;
  sceeEnergyValue: number;
  compensatedEnergyKWh: number;
  compensatedEnergyValue: number;
  publicLightingValue: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  numberClient: string;
  bills: Bill[];
  createdAt: string;
  updatedAt: string;
}

interface UseFetchClientsReturn {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchClients = (): UseFetchClientsReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/clients', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setClients(data.clients);
      setError(null);
    } catch (error) {
      setError('Não foi possível carregar os dados. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients
  };
};
