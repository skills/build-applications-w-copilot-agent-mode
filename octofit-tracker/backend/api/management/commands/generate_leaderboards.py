from django.core.management.base import BaseCommand
from api.utils import generate_individual_leaderboard, generate_team_leaderboard


class Command(BaseCommand):
    help = 'Generate leaderboards'
    
    def handle(self, *args, **options):
        metrics = ['calories', 'activities', 'consistency']
        periods = ['weekly', 'monthly', 'all_time']
        
        for metric in metrics:
            for period in periods:
                generate_individual_leaderboard(metric, period)
                generate_team_leaderboard(metric, period)
                self.stdout.write(self.style.SUCCESS(f'Generated {metric} leaderboard for {period}'))
        
        self.stdout.write(self.style.SUCCESS('All leaderboards generated'))
