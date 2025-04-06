import { formatCurrency, formatNumber } from "@/components/dashboard/format";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface BillDataDisplayProps {
  data: {
    clientName: string;
    clientNumber: string;
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
  };
}

export function BillDataDisplay({ data }: BillDataDisplayProps) {
  return (
    <Card className="mt-8 bg-green-100">
      <CardHeader>
        <CardTitle className="text-green-800">Dados Extraídos da Fatura</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-green-200">
            <CardContent>
              <p className="font-medium text-green-700">Cliente</p>
              <p className="text-xl text-green-900">{data.clientName}</p>
              <p className="text-sm text-green-600">Nº {data.clientNumber}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-200">
            <CardContent>
              <p className="font-medium text-green-700">Mês de Referência</p>
              <p className="text-xl text-green-900">{data.referenceMonth}</p>
            </CardContent>
          </Card>

          <Card className="col-span-2 bg-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Consumo de Energia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <EnergyCard
                  title="Energia Elétrica"
                  quantity={data.energyElectric.quantity}
                  value={data.energyElectric.value}
                />
                <EnergyCard
                  title="Energia SCEE"
                  quantity={data.energySCEEE.quantity}
                  value={data.energySCEEE.value}
                />
                <EnergyCard
                  title="Energia Compensada"
                  quantity={data.energyCompensated.quantity}
                  value={data.energyCompensated.value}
                />
                <Card className="bg-green-300">
                  <CardContent>
                    <p className="text-sm text-green-700">Contribuição Iluminação Pública</p>
                    <p className="font-medium text-2xl text-green-900">
                      {formatCurrency(data.publicLightingContribution)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-300">
                  <CardContent>
                    <p className="text-sm text-green-700">Valor Total</p>
                    <p className="font-medium text-2xl text-green-900">
                      {formatCurrency(data.totalValue)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

interface EnergyCardProps {
  title: string;
  quantity: number;
  value: number;
}

function EnergyCard({ title, quantity, value }: EnergyCardProps) {
  return (
    <Card className="bg-green-300">
      <CardContent>
        <p className="text-sm text-green-700">{title}</p>
        <p className="font-medium text-2xl text-green-900">{formatNumber(quantity)} kWh</p>
        <p className="text-sm text-green-600">{formatCurrency(value)}</p>
      </CardContent>
    </Card>
  );
}