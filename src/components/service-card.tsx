import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Service } from "@/lib/data";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  return (
    <div
      className="w-full opacity-0 translate-y-8 transition-all duration-700"
      data-reveal
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card
        className={`relative h-full border-border/20 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group ${
          service.popular ? "ring-2 ring-primary/20" : ""
        }`}
      >
        {service.popular && (
          <Badge className="absolute top-0 md:top-3 left-6 bg-primary text-primary-foreground">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <service.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{service.duration}</span>
            </div>
          </div>
          <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            {service.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">
              What's Included:
            </h4>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Starting at
              </span>
              <span className="text-lg font-bold text-primary">
                {service.startingPrice}
              </span>
            </div>
            <Button
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              variant="outline"
              size="sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceCard;
