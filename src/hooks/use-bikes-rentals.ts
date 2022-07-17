import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { BikeProperties } from "../models/bike-model";
import { getBikeRentals } from "../services/bike-service";

export function useBikesRentals () {
  return useQuery<BikeProperties[], FirebaseError, BikeProperties[]>('bike-rentals',() => getBikeRentals())
}