import pika
import json
import requests

def callback(ch, method, properties, body):
    request = json.loads(body)
    try:
        # Отправляем запрос на закрытое API
        response = requests.post("http://private_api:8080", json=request["data"])
        print(f"Processed request {request['id']} with status {response.status_code}")
        
        # Подтверждаем обработку сообщения
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Failed to process request {request['id']}: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)  # Повторно помещаем сообщение в очередь

# Настройка подключения к RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='request_queue', durable=True)

channel.basic_qos(prefetch_count=1)  # Обработка одного сообщения за раз
channel.basic_consume(queue='request_queue', on_message_callback=callback)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
