import { Entity } from "apps/api/src/core/entities/entity";
import { UniqueEntityID } from "apps/api/src/core/entities/unique-entity-id";
import { Optional } from "apps/api/src/core/types/optional";

interface BillProps {
  clientId: string;

  referenceMonth: Date;
  billMonth: string;
  pdfPath: string;

  energyConsumptionKwh: number;
  energyConsumptionValue: number;

  sceeEnergyKWh: number;
  sceeEnergyValue: number;

  compensatedEnergyKWh: number;
  compensatedEnergyValue: number;

  publicLightingValue: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Bill extends Entity<BillProps> {

  get clientId() {
    return this.props.clientId;
  }

  get referenceMonth() {
    return this.props.referenceMonth;
  }

  get billMonth() {
    return this.props.billMonth;
  }

  get pdfPath() {
    return this.props.pdfPath;
  }

  get energyConsumptionKwh() {
    return this.props.energyConsumptionKwh;
  }

  get energyConsumptionValue() {
    return this.props.energyConsumptionValue;
  }

  get sceeEnergyKWh() {
    return this.props.sceeEnergyKWh;
  }

  get sceeEnergyValue() {
    return this.props.sceeEnergyValue;
  }

  get compensatedEnergyKWh() {
    return this.props.compensatedEnergyKWh;
  }

  get compensatedEnergyValue() {
    return this.props.compensatedEnergyValue;
  }

  get publicLightingValue() {
    return this.props.publicLightingValue;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }


  static create(
    props: Optional<BillProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Bill {
    const bill = new Bill({
      clientId: props.clientId,
      referenceMonth: props.referenceMonth,
      billMonth: props.billMonth,
      pdfPath: props.pdfPath,
      energyConsumptionKwh: props.energyConsumptionKwh,
      energyConsumptionValue: props.energyConsumptionValue,
      sceeEnergyKWh: props.sceeEnergyKWh,
      sceeEnergyValue: props.sceeEnergyValue,
      compensatedEnergyKWh: props.compensatedEnergyKWh,
      compensatedEnergyValue: props.compensatedEnergyValue,
      publicLightingValue: props.publicLightingValue,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }, 
    id
  );

    return bill;
  }


}