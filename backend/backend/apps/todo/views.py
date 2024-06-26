import os, datetime
from django.conf import settings
from django.core.paginator import Paginator
from rest_framework import viewsets, mixins
# from rest_framework.views import APIView
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend.utils.constants.status_code import StatusCode

from todo.serializers import TodoSerializer, TodoListSerializer, GetTodoListSerializer
from todo.filters import TodoListFilter, TodoFilter
from todo.models import Todo, TodoList
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import action
# Create your views here.


class TodoLists(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    lookup_field = 'id'
    filterset_class = TodoListFilter

    def get_queryset(self, user_id=None):
        return self.queryset.filter(user_id=user_id).order_by('expect_finish_date')
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset(user_id=request.user_id))
        serializer = self.get_serializer(queryset, many=True)
        todo_lists = serializer.data
        total_lists_num = len(todo_lists)
        page = request.query_params.get('page', 1)
        if page:
            paginator_data = self.chunk_todo_list(todo_lists=list(todo_lists), page=page)
        # serializers = GetTodoListSerializer(todo_lists, many=True)
        return Response({'status_code':StatusCode.OK.value, 'todo_list':paginator_data.object_list, 'todo_list_num': total_lists_num})

    def chunk_todo_list(self, todo_lists:[list], page: int):
        paginator = Paginator(todo_lists, 18)
        try:
            return paginator.page(page)
        except:
            return todo_lists

    def create(self, request):
        print('进来了')
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status_code':StatusCode.OK.value})
        return Response({'status_code': serializer.error_code, 'message': serializer.error_message})
    
    def update(self, request, id=None):
        queryset = self.get_queryset(user_id=request.user_id)
        instance = queryset.get(id=id)
        post_data = request.data
        serializer = self.get_serializer(instance=instance, data=post_data)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({'status_code': StatusCode.OK.value, 'message': '修改成功'})
        return Response({'status_code': serializer.error_code, 'message': serializer.error_message})
    
    def destroy(self, request, id):
        TodoList.objects.get(id=id).delete()
        return Response({'status_code': StatusCode.OK.value, 'message': '删除成功'})
    
    def retrieve(self, request, id=None):
        instance = self.queryset.get(id=id)
        serializer = self.get_serializer(instance)
        return Response({'status_code': StatusCode.OK.value, 'todo_list': serializer.data})




class ChildTodoViewset(
                       mixins.DestroyModelMixin,
                       viewsets.GenericViewSet):
    serializer_class = TodoSerializer
    filterset_class = TodoFilter
    lookup_field = 'id'
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        queryset = Todo.objects.all()
        return queryset

    @swagger_auto_schema(auto_schema=None)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # def delete(self, request, id):
    #     Todo.objects.get(id=id).delete()
    #     return Response({'status_code': StatusCode.OK.value, 'message': '修改成功'})

    # @action(methods=['post'], detail=False)
    @swagger_auto_schema(
        # method='post',
        operation_summary='创建子todo',
        operation_description='子todo是父todo_list的一部分，根据list_id绑定子父todo_list',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['list_id', 'todoContent'],
            properties={
                'list_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="父todo的ID"),
                'todoContent': openapi.Schema(type=openapi.TYPE_STRING, description="Todo内容")
            },
        ),
        responses={
                200: openapi.Response(
                description="Todo successfully created",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status_code': openapi.Schema(default=200, type=openapi.TYPE_INTEGER, description="Status code"),
                        'todo_list': openapi.Schema(type=openapi.TYPE_OBJECT, description="Detailed todo list data"),
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Status message")
                    }
                )
            ),
            400: openapi.Response(description="Invalid data received")
        }
    )
    def create(self, request):
        data = request.data
        list_id = data.get('list_id')
        create_info = { 
            'body': data.get('todoContent'),
            'list_id': list_id,
            'create_datetime': datetime.datetime.now()
        }
        serializer = self.get_serializer(data=create_info)
        # serializer = TodoSerializer(data=create_info)
        if serializer.is_valid():
            if serializer.save():
                todo_list = TodoList.objects.get(id=list_id)
                one_todo_list_serializer = GetTodoListSerializer(todo_list)
            return Response({'status_code': StatusCode.OK.value, 'todo_list': one_todo_list_serializer.data, 'message': '创建成功'})
        return Response({'status_code': serializer.error_code, 'message': serializer.error_message})
    
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, args, kwargs)
        return Response({'status_code': StatusCode.OK.value})

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.is_finish = 0 if obj.is_finish == 1 else 1
        obj.save()
        return Response({'status_code': StatusCode.OK.value})

    
