import { Module, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as chokidar from 'chokidar';
import { join } from 'path';
import { PrismaService } from 'nestjs-prisma';
import { UserDto } from 'src/common/DTO/user.dto';

@Module({})
export class ReadFileModule implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}
  onApplicationBootstrap() {
    const folderPath = join('D:', 'code', 'read-file', 'readHere');

    // Đọc nội dung của các tệp tin .txt lần đầu tiên
    this.readFileContents(folderPath);

    // Theo dõi sự thay đổi trong thư mục và cập nhật nội dung của các tệp tin .txt
    chokidar.watch(folderPath).on('all', (event, path) => {
      if (event === 'change' && path.endsWith('.txt')) {
        const contents = fs.readFileSync(path, 'utf-8');
        this.saveDatabase(contents);
      }
    });
  }

  //đọc nội dung file txt
  private readFileContents(folderPath: string) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (file.endsWith('.txt')) {
        const filePath = `${folderPath}/${file}`;
        const contents: string = fs.readFileSync(filePath, 'utf-8');
        this.saveDatabase(contents);
      }
    }
  }

  // Lưu dữ liệu vào database
  private async saveDatabase(contents: string) {
    const lines = contents.split('\n');
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split('\t');
      const user: UserDto = {
        id: parseInt(columns[0]),
        name: columns[1],
        email: columns[2],
      };
      const userDb = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!userDb) {
        await this.prisma.user.create({
          data: user,
        });
      }
    }
  }
}
