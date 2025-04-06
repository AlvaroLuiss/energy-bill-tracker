import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrency } from "./format";

interface BillChartsProps {
  energyData: Array<{
    name: string;
    'Energia Elétrica': number;
    'Energia Compensada': number;
  }>;
  financialData: Array<{
    name: string;
    'Valor Total sem GD': number;
    'Economia GD': number;
  }>;
}

export function BillCharts({ energyData, financialData }: BillChartsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8">
      <Card className="bg-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Resultados de Energia (kWh)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2f855a" />
                <XAxis dataKey="name" stroke="#2f855a" />
                <YAxis stroke="#2f855a" />
                <Tooltip contentStyle={{ backgroundColor: '#f0fff4', borderColor: '#48bb78' }} />
                <Legend />
                <Bar dataKey="Energia Elétrica" fill="#48bb78" />
                <Bar dataKey="Energia Compensada" fill="#38a169" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Resultados Financeiros (R$)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2f855a" />
                <XAxis dataKey="name" stroke="#2f855a" />
                <YAxis stroke="#2f855a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f0fff4', borderColor: '#48bb78' }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Legend />
                <Bar dataKey="Valor Total sem GD" fill="#48bb78" />
                <Bar dataKey="Economia GD" fill="#38a169" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}