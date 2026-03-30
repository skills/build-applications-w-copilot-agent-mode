from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from api.models import User, Activity, Team, TeamMember, Workout, WorkoutRecommendation, Leaderboard


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'age', 'gender', 'fitness_level', 'goals', 'bio', 'avatar_url',
            'total_calories_burned', 'total_distance_km', 'current_streak', 'longest_streak',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_calories_burned', 'total_distance_km']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            'id', 'user', 'activity_type', 'duration_minutes', 'calories_burned',
            'distance_km', 'intensity', 'description', 'timestamp', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = ['id', 'user', 'user_details', 'role', 'joined_at']


class TeamSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = [
            'id', 'name', 'description', 'owner', 'owner_details',
            'total_activities', 'total_calories_burned', 'members_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'total_activities', 'total_calories_burned', 'created_at', 'updated_at']
    
    def get_members_count(self, obj):
        return obj.members.count()


class WorkoutExerciseSerializer(serializers.Serializer):
    name = serializers.CharField()
    duration_minutes = serializers.IntegerField()
    reps = serializers.IntegerField(required=False, allow_null=True)
    sets = serializers.IntegerField(required=False, allow_null=True)
    intensity = serializers.ChoiceField(choices=['low', 'moderate', 'high'])


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = [
            'id', 'name', 'description', 'exercises', 'difficulty_level',
            'estimated_calories', 'recommended_frequency', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class WorkoutRecommendationSerializer(serializers.ModelSerializer):
    workout_details = WorkoutSerializer(source='workout', read_only=True)
    
    class Meta:
        model = WorkoutRecommendation
        fields = [
            'id', 'user', 'workout', 'workout_details', 'reason',
            'recommended_date', 'completed', 'completed_at', 'feedback',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    entity_id = serializers.IntegerField()
    entity_name = serializers.CharField()
    score = serializers.FloatField()


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = [
            'id', 'leaderboard_type', 'metric', 'period',
            'entries', 'generated_at', 'updated_at'
        ]
        read_only_fields = fields
