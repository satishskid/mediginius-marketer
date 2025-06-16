class HealthcareAPIPool:
    def __init__(self):
        self.model_pool = self.initialize_model_pool()
        self.routing_intellig