-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "referenceMonth" TIMESTAMP(3) NOT NULL,
    "billMonth" TEXT NOT NULL,
    "pdfPath" TEXT NOT NULL,
    "energyConsumptionKwh" DECIMAL(65,30) NOT NULL,
    "energyConsumptionValue" DECIMAL(65,30) NOT NULL,
    "sceeEnergyKWh" DECIMAL(65,30) NOT NULL,
    "sceeEnergyValue" DECIMAL(65,30) NOT NULL,
    "compensatedEnergyKWh" DECIMAL(65,30) NOT NULL,
    "compensatedEnergyValue" DECIMAL(65,30) NOT NULL,
    "publicLightingValue" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
