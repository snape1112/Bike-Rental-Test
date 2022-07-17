import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { ReserveProperties } from "../models/reserve-model";
import { getAllReserves } from "../services/reserve-service";

export function useReserves () {
  return useQuery<ReserveProperties[], FirebaseError, ReserveProperties[]>('reserves', () => getAllReserves())
}