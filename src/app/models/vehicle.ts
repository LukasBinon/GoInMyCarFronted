export interface Vehicle {
  // Noms exacts envoyés par votre API C#
  vehicle_id: number;
  make: string;
  model: string;
  price_per_day: number;   // Correspond à C#
  is_available: boolean;
  image_url: string;       // Correspond à C#
  location: string;
  seat_count: number;
  car_description: string;
  transmission: string;
  fuel_type: string;
}
